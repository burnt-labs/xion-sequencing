use std::sync::{Arc, mpsc, Mutex};
use std::thread;
use std::time::Duration;

fn producer(tx: mpsc::Sender<String>, queue: Arc<Mutex<Vec<String>>>) {
    for i in 0..10 {
        let item = format!("item {}", i);
        tx.send(item.clone()).unwrap();
        queue.lock().unwrap().push(item.clone());
        println!("Produced {}", item);
        thread::sleep(Duration::from_secs(1));
    }
}

fn consumer(rx: mpsc::Receiver<String>, queue: Arc<Mutex<Vec<String>>>) {
    while let Ok(item) = rx.recv() {
        println!("Consumed {}", item);
        thread::sleep(Duration::from_secs(2));
        let mut q = queue.lock().unwrap();
        if let Some(pos) = q.iter().position(|x| *x == item) {
            q.remove(pos);
        }
    }
}

fn main() {
    let queue = Arc::new(Mutex::new(Vec::new()));
    let (tx, rx) = mpsc::channel();
    let producer_queue = Arc::clone(&queue);
    let consumer_queue = Arc::clone(&queue);

    let producer_handle = thread::spawn(move || {
        producer(tx, producer_queue);
    });

    let consumer_handle = thread::spawn(move || {
        consumer(rx, consumer_queue);
    });

    producer_handle.join().unwrap();
    consumer_handle.join().unwrap();
}
