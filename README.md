# What
An extension for vscode that lets you search hashicorp registry for docs on cloud resources.

I have very little JS knowledge, this is probably horribly inefficient, this is built using Stack Overflow, Reddit, and lots and lots of Google, maybe a little ChatGPT, cant actually remember if the code it gave me worked or not.

# How
Simply select the word or function you want to search, then right click and click on `Search with Terraform Registry` in drop-down menu.

Say you have a resource defined like `resource "aws_s3_bucket" "foo" {` this splits the `aws` and the `s3_bucket` and
searches for [https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)

# Why
When refactoring lots of terraform code, I always needed to copy and paste the resource definition into google, find the docs, this speeds that process up a little bit.

# What I work with
Here are the following providers I have tested it to work with:
- AWS
- GCP
- AZURE
- Kubernetes
- Helm


As long as the provider name is the first item in the resource definition this **should** work.

This also works for data blocks since we get the previous word in the selection. So make sure you highlight the definition IE: `aws_cloudwatch_event_connection` or `aws_cloudwatch_event_connection` and it will work out if its a `data` or `resource` type

# Screenshots
![](/static/search1.jpg)


![](/static/search2.jpg)