.PHONY: doc test coverage

doc:
	npx hardhat docgen

test:
	npx hardhat test 

coverage:
	npx hardhat coverage 