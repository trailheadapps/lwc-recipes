heroku pipelines:destroy nunchucks-pipeline
heroku apps:destroy -a nunchucks-dev -c nunchucks-dev
heroku apps:destroy -a nunchucks-staging -c nunchucks-staging
heroku apps:destroy -a nunchucks-prod -c nunchucks-prod
rm -- "destroynunchucks.sh"
