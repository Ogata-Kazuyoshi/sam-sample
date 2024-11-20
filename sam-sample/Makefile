sam-local:
	sam build
	sam local start-api

sam-deploy:
	sam build
	sam deploy --no-confirm-changeset --no-fail-on-empty-changeset --parameter-overrides DIGIp=$(DIG_IP)
