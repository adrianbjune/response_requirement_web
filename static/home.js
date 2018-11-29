$(document).ready(
	async function(){
		const response = await $.ajax('/retrieve', {
			method: 'POST',
			contentType: 'application/json'
	})

		$('#previously_predicted').html('<thead><tr>' +
										'<th class="prediction_class">Prediction</th>' +
										'<th class="prediction_text">Message</th>' +
										'</tr></thead><tbody>')
		console.log(response)
		$.each(response.items, function(index, element){
			

			$('#previously_predicted').append('<tr><td class="prediction_class">'+element.prediction+'</td>'+
											'<td class="prediction_text">'+element.text+'</td></tr>')
		})
		$('#previously_predicted').append('</tbody>')
		$('#prediction_text').text('')
		$('#prediction_class').val('')
		$('#evaluation_div').hide()
		$('#prediction_div').show()
	})

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
		$('#prediction').html('<h2>Prediction:</h2>' + response.prediction)
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

		$('#previously_predicted').html('<thead><tr>' +
										'<th class="prediction_class">Prediction</th>' +
										'<th class="prediction_text">Message</th>' +
										'</tr></thead><tbody>')
		console.log(response)
		$.each(response.items, function(index, element){
			

			$('#previously_predicted').append('<tr><td class="prediction_class">'+element.prediction+'</td>'+
											'<td class="prediction_text">'+element.text+'</td></tr>')
		})
		$('#previously_predicted').append('</tbody>')
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
		console.log(data)
		
		const response = await $.ajax('/update', {
			data: JSON.stringify(data),
			method: 'POST',
			contentType: 'application/json'
		})
		
		$('#previously_predicted').html('<thead><tr>' +
										'<th class="prediction_class">Prediction</th>' +
										'<th class="prediction_text">Message</th>' +
										'</tr></thead><tbody>')
		console.log(response)
		$.each(response.items, function(index, element){

			$('#previously_predicted').append('<tr><td class="prediction_class">'+element.prediction+'</td>'+
											'<td class="prediction_text">'+element.text+'</td></tr>')
		})
		$('#previously_predicted').append('</tbody>')
		$('#prediction_text').text('')
		$('#prediction_class').val('')

		$('#evaluation_div').hide()
		$('#eval_2').hide()
		$('#eval_1').show()
		$('#prediction_div').show()
		$('input[name=class]:checked').prop('checked', false)
	})


	$('.radio_text').click(async function(){
		console.log($(this).attr('value'))
		$('input[name=class][value='+$(this).attr('value')+']').prop('checked', true)
	})

})