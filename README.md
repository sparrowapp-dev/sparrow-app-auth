<p align="center">
<a href="https://sparrows-newsletter.beehiiv.com/subscribe">
<img src="https://sparrowassets.blob.core.windows.net/publicassest/sparrow-logo.png" width="400" alt="logo"/>
</a>
</p>

<h1 align="center">
Sparrow Identity Server
<h4 align="center">
This is an identity server for handling authentication in Sparrow.
</h4>
</h1>

## <a name="installation">🔨 Installation</a>

To setup the auth server, you will need to have the following installed on your machine :

![NODE](https://img.shields.io/badge/-Node.js-black?style=for-the-badge&logoColor=white&logo=nodedotjs&color=339933)
![Yarn](https://img.shields.io/badge/-Yarn-black?style=for-the-badge&logoColor=white&logo=yarn&color=2C8EBB)
![Docker](https://img.shields.io/badge/-Docker-black?style=for-the-badge&logoColor=white&logo=docker&color=2496ED)

### Prerequisite:

```bash
# Clone the repository
git clone https://github.com/sparrowapp-dev/sparrow-app-auth.git

# Move into the project directory
cd sparrow-app-auth

# Install yarn globally
npm i -g yarn

# Create and setup environments file
cp .env.example .env
```

### Non-Docker Method

```bash
# Install dependencies
	yarn

# Run App in development mode
	yarn dev
```

### Access auth server on localhost:

Go to http://localhost:1421/

### Default User for Login:

Sparrow creates a default user to help you get started quickly and easily.

    NOTE: This only works if you have initialized the Sparrow backend server.

**Login Credentials:**

- **Email:** dev@sparrow.com
- **Password:** 12345678@
