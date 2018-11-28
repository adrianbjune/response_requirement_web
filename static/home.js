$(document).ready(function(){

	console.log('document is ready')

	$('#predict').click(async function(){
		console.log('button was clicked')
		const text = $('#text').val()
		console.log(text)
		data = {
			text
		}
		const response = await $.ajax('/predict',{
			data: JSON.stringify(data),
			method: 'POST',
			contentType: 'application/json'
		})
		console.log(response)
		$('#prediction_text').text(text)
		$('#prediction').text(response.prediction)
		$('#prediction_class').val(response.class)
		$('#class_0_prediction').text(response.c0 + '% chance of no response required.')
		$('#class_1_prediction').text(response.c1 + '% chance of a vague/general chat question.')
		$('#class_2_prediction').text(response.c2 + '% chance of an explicit question.')
		$('#class_3_prediction').text(response.c3 + '% chance of an explicit call to action.')
		$('#prediction_div').hide()
		$('#evaluation_div').show()
		$('#text').val('Type your message here')
	})

	$('#correct').click(async function(){
		const text = $('#prediction_text').text()
		const predicted = $('#prediction_class').val()
		label = predicted
		data = {
			text,
			label,
			predicted 
		}

		const response = await $.ajax('/update', {
			data: JSON.stringify(data),
			method: 'POST',
			contentType: 'application/json'
		})

		$('#previously_predicted').html('')
		$.each(response.items, function(index, element){
			console.log(element)

			$('#previously_predicted').append('<div>'+element.text+'</div>')
		})

		$('#prediction_text').text('')
		$('#prediction_class').val('')
		$('#evaluation_div').hide()
		$('#prediction_div').show()
	})

	$('#incorrect').click(async function(){
		$('#eval_1').hide()
		$('#eval_2').show()
	})

	$('#submit').click(async function(){

		const text = $('#prediction_text').text()
		const predicted = $('#prediction_class').val()
		const label = $('input[name=class]:checked').val()

		data = {
			text,
			label,
			predicted 
		}

		const response = await $.ajax('/update', {
			data: JSON.stringify(data),
			method: 'POST',
			contentType: 'application/json'
		})

		$('#previously_predicted').html('')
		$.each(response.items, function(index, element){
			console.log(element)

			$('#previously_predicted').append('<div>'+element.text+'</div>')
		})
		$('#prediction_text').text('')
		$('#prediction_class').val('')

		$('#evaluation_div').hide()
		$('#eval_2').hide()
		$('#eval_1').show()
		$('#prediction_div').show()
		$('input[name=class]:checked').prop('checked', false)
	})

})