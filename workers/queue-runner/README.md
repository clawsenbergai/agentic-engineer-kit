# queue-runner worker

Verwerkt korte asynchrone taken (BullMQ stijl):
- dequeue
- execute step
- emit run event
- requeue/retry where allowed
