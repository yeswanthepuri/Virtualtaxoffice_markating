using Minio;
using Minio.DataModel.Args;

namespace MarketingSite.Services
{
    public class MinIOService
    {
        private readonly IMinioClient _minioClient;
        private readonly string _bucketName;

        public MinIOService(IConfiguration configuration)
        {
            var endpoint = configuration["MinIO:Endpoint"];
            var accessKey = configuration["MinIO:AccessKey"];
            var secretKey = configuration["MinIO:SecretKey"];
            _bucketName = configuration["MinIO:BucketName"] ?? "uploads";

            _minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .Build();
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            await EnsureBucketExistsAsync();
            
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            
            using var stream = file.OpenReadStream();
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(fileName)
                .WithStreamData(stream)
                .WithObjectSize(file.Length)
                .WithContentType(file.ContentType);

            await _minioClient.PutObjectAsync(putObjectArgs);
            return fileName;
        }

        public async Task<Stream> GetFileAsync(string fileName)
        {
            var memoryStream = new MemoryStream();
            var getObjectArgs = new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(fileName)
                .WithCallbackStream(stream => stream.CopyTo(memoryStream));

            await _minioClient.GetObjectAsync(getObjectArgs);
            memoryStream.Position = 0;
            return memoryStream;
        }

        private async Task EnsureBucketExistsAsync()
        {
            var bucketExistsArgs = new BucketExistsArgs().WithBucket(_bucketName);
            bool found = await _minioClient.BucketExistsAsync(bucketExistsArgs);
            
            if (!found)
            {
                var makeBucketArgs = new MakeBucketArgs().WithBucket(_bucketName);
                await _minioClient.MakeBucketAsync(makeBucketArgs);
            }
        }
    }
}