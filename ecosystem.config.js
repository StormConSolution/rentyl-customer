// this file is used for pm2 deployment
module.exports = {
	apps: [
		{
			name: 'dev-customer',
			script: 'pm2_serve.sh',
			wait_ready: true,
			kill_timeout: 10000,
			listen_timeout: 10000,
			// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/#ecosystem-file
			args: '',
			// instances: 'max',
			// exec_mode: 'cluster',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				SERVE_PORT: 5100,
				NODE_ENV: 'development',
				PM2_KILL_TIMEOUT: 10000
			}
		},
		{
			name: 'qa-customer',
			script: 'pm2_serve.sh',
			wait_ready: true,
			kill_timeout: 10000,
			listen_timeout: 10000,
			// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/#ecosystem-file
			args: '',
			// instances: 'max',
			// exec_mode: 'cluster',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				SERVE_PORT: 5100,
				NODE_ENV: 'development',
				PM2_KILL_TIMEOUT: 10000
			}
		},
		{
			name: 'uat-customer',
			script: 'pm2_serve.sh',
			wait_ready: true,
			kill_timeout: 10000,
			listen_timeout: 10000,
			// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/#ecosystem-file
			args: '',
			// instances: 'max',
			// exec_mode: 'cluster',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				SERVE_PORT: 5100,
				NODE_ENV: 'development',
				PM2_KILL_TIMEOUT: 10000
			}
		},
		{
			name: 'stage-customer',
			script: 'pm2_serve.sh',
			wait_ready: true,
			kill_timeout: 10000,
			listen_timeout: 10000,
			// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/#ecosystem-file
			args: '',
			// instances: 'max',
			// exec_mode: 'cluster',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				SERVE_PORT: 6100,
				NODE_ENV: 'development',
				PM2_KILL_TIMEOUT: 10000
			}
		},
		{
			name: 'prod-customer',
			script: 'pm2_serve.sh',
			wait_ready: true,
			kill_timeout: 10000,
			listen_timeout: 10000,
			// Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/#ecosystem-file
			args: '',
			// instances: 'max',
			// exec_mode: 'cluster',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				SERVE_PORT: 5000,
				PM2_KILL_TIMEOUT: 10000
			}
		}
	],
	deploy: {
		prod: {
			key: '~/.ssh/id_rsa.pub',
			user: 'dev',
			host: ['prod.spireloyalty.com'],
			ref: 'origin/master',
			repo: 'git@gitlab.com:plvr/ndm/spire-customer.git',
			path: '/home/dev/prod/customer',
			'post-deploy': 'yarn && yarn build && sudo pm2 startOrReload ecosystem.config.js --only prod-customer'
		},
		stage: {
			key: '~/.ssh/id_rsa.pub',
			user: 'dev',
			host: ['3.19.231.115'],
			ref: 'origin/dev',
			repo: 'git@gitlab.com:plvr/ndm/spire-customer.git',
			path: '/home/dev/stage/customer',
			'post-deploy':
				'yarn && yarn build:debug && sudo pm2 startOrReload ecosystem.config.js --only stage-customer'
		},
		sand: {
			key: '~/.ssh/id_rsa.pub',
			user: 'dev',
			host: ['sand.spireloyalty.com'],
			ref: 'origin/dev',
			repo: 'git@gitlab.com:plvr/ndm/spire-customer.git',
			path: '/home/dev/sand/customer',
			'post-deploy': 'yarn && yarn build:debug && sudo pm2 startOrReload ecosystem.config.js --only sand-customer'
		}
	}
};
