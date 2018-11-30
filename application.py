from flask import Flask, request, jsonify, render_template, jsonify, Response
import pickle
import numpy as numpy
import pandas as pd
import boto3
import time
import nltk

#nltk.download('punkt')
#nltk.download('averaged_perceptron_tagger')

application = Flask(__name__)

s3 = boto3.resource('s3', 'us-east-1')
object = s3.Object('adrian-kettle-capstone', 'model.pkl')
model = pickle.loads(object.get()['Body'].read())

forbidden = ['fuck', 'fuk', 'shit', 'sex', 'damn', 'bitch', 'cunt']

dynamodb = boto3.resource('dynamodb', 'us-east-1')
table = dynamodb.Table('response_requirements')

categories = {0 : 'no response required',
				  1 : 'vague/general chat question',
				  2 : 'explicit question',
				  3 : 'explicit call to action'}

@application.route('/response_expectations', methods = ['GET'])
def home():
	
	return render_template('home.html')
	


@application.route('/predict', methods=['POST'])
def predict():
	
	req = request.get_json()
	text = req['text']
	to_predict = pd.DataFrame({'text':[text]})
	prediction = model.predict(to_predict)
	percentages = model.predict_proba(to_predict)
	class_0 = '{0:.2f}'.format(percentages[0][0]*100)
	class_1 = '{0:.2f}'.format(percentages[0][1]*100)
	class_2 = '{0:.2f}'.format(percentages[0][2]*100)
	class_3 = '{0:.2f}'.format(percentages[0][3]*100)

	result = {
		'class' : prediction[0],
		'prediction' : categories[prediction[0]],
		'c0' : class_0,
		'c1' : class_1,
		'c2' : class_2,
		'c3' : class_3
	}
	return jsonify(result)

@application.route('/update', methods=['POST'])
def update():
	req = request.get_json()
	print(req)

	table.put_item(
		Item={
			'label' : int(req['label']),
			'prediction' : int(req['predicted']),
			'text' : req['text'],
			'timestamp' : int(time.time())
		})

	updated = retrieve()
	return updated
	

@application.route('/retrieve', methods=['POST'])
def retrieve():
	print('retrieving data')
	response = table.scan()
	print(response)
	messages = []
	print(len(response['Items']))
	for mess in response['Items']:
		if not any([word in mess['text'] for word in forbidden]):
			print('adding ' + mess['text'])
			if mess['label'] == mess['prediction']:
				img = 'check.png'
			else:
				img = 'x.png'
			messages.append({'text':mess['text'], 
				'image':img,
				'prediction':categories[int(mess['prediction'])],
				'ts':int(mess['timestamp'])})

	messages.sort(reverse=True, key=(lambda x : x['ts']))

	return jsonify({'items':messages})

if __name__ == '__main__':

	application.debug = True
	application.run()