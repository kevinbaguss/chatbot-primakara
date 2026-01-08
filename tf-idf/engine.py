import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity 
from PreProcessing import preprocess

with open("dataset/FAQ_dataset.json", encoding="utf-8") as f:
    faq = json.load(f)

question = []
answers = []

for item in faq :
    for q in item ["questions"]:
        question.append(preprocess(q))
        answers.append(item["answere"])

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(question)

def response(user_input):
    user_input = preprocess(user_input)
    user_vec = vectorizer.transform([user_input])
    similarity = cosine_similarity(user_vec, X)
    idx = similarity.argmax()

    if similarity[0][idx] < 0.3:
        return "maaf saya belum menemukan informasi tersebut"
    
    return answers[idx]