docker build -t panorama-api .

docker tag panorama-api public.ecr.aws/o9k5r3t0/panorama-api:latest

docker push public.ecr.aws/o9k5r3t0/panorama-api:latest

aws apprunner start-deployment --service-arn "arn:aws:apprunner:eu-west-1:254243831699:service/panorama-api/8fd95f2fc9234e59ae400d6ea4110dac"