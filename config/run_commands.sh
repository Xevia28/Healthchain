export PATH="/workspaces/healthchain/bin:$PATH"

cryptogen generate --config=./crypto-config.yaml --output=crypto-config
configtxgen -outputBlock ./orderer/healthchaingenesis.block -channelID ordererchannel -profile HealthchainOrdererGenesis
configtxgen -outputCreateChannelTx ./healthchainchannel/healthchainchannel.tx -channelID healthchainchannel -profile HealthchainChannel
