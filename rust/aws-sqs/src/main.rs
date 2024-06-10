use std::error::Error as StdError;
use std::sync::Arc;

use aws_config::meta::region::RegionProviderChain;
use aws_sdk_sqs::{Client, Config, Credentials, Endpoint, Region};
use serde::{Deserialize, Serialize};
use tokio::time::{Duration, sleep};

#[derive(Serialize, Deserialize, Debug)]
struct Message {
    body: String,
}

async fn producer(client: Arc<Client>, queue_url: Arc<String>) -> Result<(), Box<dyn StdError + Send + Sync>> {
    for i in 0..10 {

        // Construct message with transaction parameters here
        let msg = Message { body: format!("item {}", i) };

        client.send_message()
            .queue_url(&**queue_url)
            .message_body(serde_json::to_string(&msg)?)
            .send()
            .await?;

        println!("Produced: {}", msg.body);
        sleep(Duration::from_secs(1)).await;
    }

    // Send a message to stop the consumer
    let msg = Message { body: "DONE".to_string() };
    client.send_message()
        .queue_url(&**queue_url)
        .message_body(serde_json::to_string(&msg)?)
        .send()
        .await?;

    Ok(())
}

async fn consumer(client: Arc<Client>, queue_url: Arc<String>) -> Result<(), Box<dyn StdError + Send + Sync>> {
    loop {
        let resp = client.receive_message()
            .queue_url(&**queue_url)
            .max_number_of_messages(1)
            .wait_time_seconds(10)
            .send()
            .await?;

        if let Some(messages) = resp.messages {
            for message in messages {
                if let Some(body) = &message.body {
                    let msg: Message = serde_json::from_str(body)?;
                    println!("Consumed: {}", msg.body);

                    // Call the chain here

                    client.delete_message()
                        .queue_url(&**queue_url)
                        .receipt_handle(message.receipt_handle.unwrap())
                        .send()
                        .await?;

                    if msg.body == "DONE" {
                        return Ok(());
                    }

                    sleep(Duration::from_secs(2)).await;
                }
            }
        } else {
            sleep(Duration::from_secs(1)).await;
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn StdError + Send + Sync>> {
    let region_provider = RegionProviderChain::default_provider().or_else(Region::new("us-east-1"));
    let credentials_provider = Credentials::new("test", "test", None, None, "");
    let _config = aws_config::from_env()
        .region(region_provider)
        .credentials_provider(credentials_provider.clone())
        .load()
        .await;

    let client = Arc::new(Client::from_conf(
        Config::builder()
            .region(Region::new("us-east-1"))
            .credentials_provider(credentials_provider)
            .endpoint_resolver(Endpoint::immutable("http://localhost:4566".parse().expect("valid endpoint")))
            .build()
    ));

    let queue_url = Arc::new("http://localhost:4566/000000000000/queue".to_string());

    let producer_handle = tokio::spawn(producer(client.clone(), queue_url.clone()));
    let consumer_handle = tokio::spawn(consumer(client.clone(), queue_url.clone()));

    producer_handle.await??;
    consumer_handle.await??;

    Ok(())
}
