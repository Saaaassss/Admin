from flask import Flask, render_template, jsonify, send_from_directory
import json
import os

app = Flask(__name__)
JSON_FILE = 'links.json'

# Read links from JSON file
def read_links():
    if not os.path.exists(JSON_FILE):
        return {}
    with open(JSON_FILE, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

# Main landing page with all tools
@app.route('/')
@app.route('/main')
def main():
    return render_template('main.html')

# Jenkins page
@app.route('/jenkins')
def jenkins():
    return render_template('jenkins.html')

# JFrog Artifactory page
@app.route('/jfrog')
def jfrog():
    return render_template('jfrog.html')

# API: Get all data from links.json for frontend
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(read_links())

# Serve CSS files from templates folder
@app.route('/templates/<path:filename>')
def serve_templates(filename):
    return send_from_directory('templates', filename)

# Serve images
@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
