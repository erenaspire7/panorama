docker build -t panorama-python-layer .

docker tag panorama-python-layer public.ecr.aws/o9k5r3t0/panorama-py:latest

docker push public.ecr.aws/o9k5r3t0/panorama-py:latest

$taskDef = aws ecs describe-task-definition --task-definition python-layer --region=eu-west-1 | ConvertFrom-Json

$containerDefinitions = $taskDef.taskDefinition.containerDefinitions | ConvertTo-Json -Compress
$containerDefinitions = $containerDefinitions -replace '"', '\"'

$runtimePlatform = @{
    cpuArchitecture = "X86_64"
    operatingSystemFamily = "LINUX"
}

$runtimePlatform = $runtimePlatform | ConvertTo-Json -Compress
$runtimePlatform = $runtimePlatform -replace '"', '\"'

$requiresCompatibilities = @("FARGATE") | ConvertTo-Json

$newTaskDef = aws ecs register-task-definition `
    --family python-layer `
    --container-definitions $containerDefinitions `
    --memory 512 `
    --cpu 256 `
    --task-role-arn "arn:aws:iam::254243831699:role/ecsTaskExecutionRole" `
    --execution-role-arn "arn:aws:iam::254243831699:role/ecsTaskExecutionRole" `
    --network-mode "awsvpc" `
    --runtime-platform $runtimePlatform `
    --requires-compatibilities $requiresCompatibilities | ConvertTo-Json

aws ecs update-service --cluster panorama --service python-layer --task-definition $newTaskDef.taskDefinition.taskDefinitionArn
