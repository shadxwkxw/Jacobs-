from transformers import DistilBertConfig

config = DistilBertConfig.from_pretrained(
    "distilbert-base-uncased", 
    num_labels=2,
    id2label={0: "Принято", 1: "Заблокировано"}
)
config.save_pretrained(".")
