document.addEventListener('DOMContentLoaded', () => {
	init()

	$('#name').keyup(handleLabelKeyup)
	$('#status').click(handleGetStatus)

	nameUrlParameter(handleGetStatus)
})

/**
 * Get status from backend
 */
function handleGetStatus() {
	let name = $('#name').val()

	history.pushState(name, document.title, '?name=' + name)

	$.ajax({
		type: 'GET',
		url: window.location.origin + '/status',
		data: { 'name': name },
        beforeSend: () => $('#name-action-loading').show(),
        complete: () => $('#name-action-loading').hide(),
		success: (response) => displayStatus(response),
		error: () => $('#server-error').show()
	})
}

/**
 * parses and displays status query result
 * @param {string} response status query response
 */
function displayStatus (response) {
	let status = JSON.parse(response)
	let name = $('#name').val()

	let label = '', actionText = '', action = ''
	
	switch (status[0]) {
		case '0':
			label = '<span class="label label-success">Open</span>'
			actionText = 'The name is available and the auction hasn’t started'
			action = linkToRegister(name, 'Register the domain')
			break
		case '1':
			label = '<span class="label label-primary">Auction</span>'
			actionText = 'The name is available and the auction has been started'
			action = linkToRegister(name, 'Bid for the name')
			break
		case '2':
			label = '<span class="label label-info">Owned</span>'
			actionText = 'The name is owned by someone'
			action = ''
			break
		case '4':
			label = '<span class="label label-warning">Reveal</span>'
			actionText = 'Domain is currently in the ‘reveal’ stage of the auction'
			action = linkToRegister(name, 'Unseal your bid')
			break
	}

	$('#domain-state').html(label)
	$('#domain-action-text').html(actionText)
	$('#domain-action').html(action)

	$('#result').show()
}

/**
 * Creates an a element with a link to register
 * @param {name} name url parameter
 * @param {message} message display message
 */
function linkToRegister(name, message) {
    return '<a class="btn btn-default btn-sm" href="/register-a-domain?name=' + name + '">' + message + '</a>'
}
