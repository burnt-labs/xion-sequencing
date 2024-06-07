use async_std::task;
use redis::AsyncCommands;
use std::time::Duration;

async fn producer(client: redis::Client) {
    let mut con = client.get_async_connection().await.unwrap();
    for i in 0..10 {
        let item = format!("item {}", i);
        let _: () = con.rpush("queue", &item).await.unwrap();
        println!("Produced {}", item);
        task::sleep(Duration::from_secs(1)).await;
    }
}

async fn consumer(client: redis::Client) {
    let mut con = client.get_async_connection().await.unwrap();
    loop {
        let item: Option<String> = con.lpop("queue", None).await.unwrap();
        match item {
            Some(value) => {
                println!("Consumed {}", value);
                task::sleep(Duration::from_secs(2)).await;
            }
            None => {
                break;
            }
        }
    }
}

fn main() {
    let client = redis::Client::open("redis://localhost/").unwrap();

    task::block_on(async {
        let producer_handle = task::spawn(producer(client.clone()));
        let consumer_handle = task::spawn(consumer(client));

        producer_handle.await;
        consumer_handle.await;
    });
}
