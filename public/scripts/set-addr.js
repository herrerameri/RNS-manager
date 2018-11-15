document.addEventListener('DOMContentLoaded', function () {
	init()

	$('#name').keyup(handleNameKeyup)
	$('#address').keyup(handleAddressKeyup)
	$('#addr').click(handleGetRecord)
    $('#set-addr').click(handleSetAddr)

	hasMetaMask()

	nameUrlParameter(handleGetRecord)
})

/**
 * Get a domain resolution with MetaMask
 */
function handleGetRecord () {
	let RNS = getRNS()
	let name = $('#name').val()

	history.pushState(name, document.title, "?name=" + name)

	let hash = namehash(name + '.' + config.tld)

	RNS.resolver(hash, (err, res) => {
		if (notNullAddress(res)) {
			let resolver = getResolver(res)
			
			resolver.addr(hash, (err2, res2) => {
				$('#display-address').html(toChecksumAddress(res2, config.chainId))
				$('#addr-response').show()
			})
		}
		else {
			$('.setter').attr('disabled', true)
			$('#no-resolution').show()
		}
	})
}

/**
 * Set a domain resolution with MetaMask
 */
function handleSetAddr() {
	var RNS = getRNS()

	let name = $('#name').val()

	executeTx('#address', '#set-owner')

	let hash = namehash(name + '.' + config.tld)

	$('#addr-action-loading').show()
    $('.disable-on-addr-invalid').attr('disabled', true)

	RNS.resolver(hash, (err, res) => {
		if(!err) {
			let resolver = getResolver(res)
			let address = $('#address').val()
			
			resolver.setAddr(hash, address, (err2, res2) => {
				finalizeTx('#addr-action-loading', '#set-owner', err2, res2)
				if(!err2) $('#check-resolution').show()
			})
		}
	})
}
