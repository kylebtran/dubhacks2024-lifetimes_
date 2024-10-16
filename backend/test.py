from openai import OpenAI
import json
with open("config.json") as config_file:
    config = json.load(config_file)
    perplexity_api_key = config["perplexity-api-key"]

url = "https://api.perplexity.ai/chat/completions"

dream = "I find myself standing in a city made entirely of glass. Every building stretches toward the sky like delicate, shimmering towers, reflecting an endless expanse of stars above. The sky isn’t dark, though—it glows with a soft, otherworldly light, illuminated by not just one moon, but dozens. Each moon is a different color—some are pale silver, others are deep violet, soft pink, or golden—and they seem to hang impossibly close, like lanterns suspended just out of reach. As I walk, my footsteps create ripples on the smooth surface of the streets, which are as clear as water. The ripples spread outward in perfect circles, but instead of fading, they cause the glass around me to hum softly, like a distant melody. There are no people here, just the quiet song of the city and the moons watching. Suddenly, I notice something strange: a seed in my palm, glowing faintly. Before I can react, it takes root in my hand, growing rapidly into a tree that spirals upward in twisting, crystalline branches. The branches stretch, and as they reach their full length, they begin to turn into birds—translucent and shimmering, as if made of light. The birds lift off, circling me, and I feel my feet leave the ground. They carry me higher and higher, past the towering glass structures, past the glowing moons, until I am weightless. The city below fades into a blur of shimmering light, and I am no longer solid—just a part of the night sky, dissolving into the stars. I feel no fear, only a deep sense of peace, as if I’ve returned to where I belong."

client = OpenAI(api_key=perplexity_api_key, base_url="https://api.perplexity.ai")

response = client.chat.completions.create(
    model="llama-3.1-sonar-small-128k-chat",
    messages=[
        {
            "role": "system",
            "content": "You are an artificial intelligence dream analyst and you need to rate the dream on a scale of 0-10 for the following emotions: happiness, sadness, fear, anger, surprise, and disgust. Do so in the most objective way possible, and your response should only contain the ratings as a JSON. Do not include anything outside the brackets."
        },
        {
            "role": "user",
            "content": dream,
        },
    ],
    max_tokens=100,
    temperature=0.0,
)

feed = response.choices[0].message.content

print(feed)

ratings = json.loads(feed)

document = {
    "dream": dream,
    "ratings": ratings
}

print(document)