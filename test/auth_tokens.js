var assert = require('assert');
var auth_tokens = require('../auth_tokens.js');

describe('validate_rtoken', function(){
    it('returns -1 if no parameter is given', function(){
        assert.equal(-1, auth_tokens.validate_rtoken(null, null));
    })

    it('returns -1 if request token is not in record', function(){
        assert.equal(-1, auth_tokens.validate_rtoken('DEADBEEF', 'Any secret'));
    })

    it('returns uid if request token is in record and not expired', function(){
        assert.equal(9999, auth_tokens.validate_rtoken('12dea96fec20593566ab75692c9949596833adc9', 'Any secret'));
    })
    it('returns -1 if request token is in record but expired', function(){
        assert.equal(-1, auth_tokens.validate_rtoken('12dea96fec20593566ab75692c9949596833adc0', 'Any secret'));
    })
})

describe('retrieve_rtoken', function(){
    beforeEach(function(){
    })

    it('returns null if no parameter is given', function(){
        assert.equal(null, auth_tokens.retrieve_rtoken(null, null));
    })

    it('returns null if non-existing auth-token is given', function(){
        assert.equal(null, auth_tokens.retrieve_rtoken('DEADBEEF', 'Any secret'));
    })

    it('returns rtoken if valid auth-token is given', function(){
        assert.equal("12dea96fec20593566ab75692c9949596833adc9", auth_tokens.retrieve_rtoken('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Any secret'));
    })
    
    it('returns rtoken again if valid auth-token is not used up', function(){
        assert.equal("12dea96fec20593566ab75692c9949596833adc9", auth_tokens.retrieve_rtoken('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Any secret'));
    })
    
    it('removes used token if total is 0 now', function(){
        assert.equal(null, auth_tokens.retrieve_rtoken('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Any secret'));
    })
})
