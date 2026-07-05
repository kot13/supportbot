# Single sign-on (SSO)

Single sign-on is used to login users into the InAppStory console
and manage their access roles through its own user account service, 
such as Keycloak.

# Configuring Integration

## Setting up account service

### Setting up Keycloak

#### Create realm

![](/images/sso/1-realm-1.png)

![](/images/sso/1-realm-2.png)

![](/images/sso/1-realm-3.png)

![](/images/sso/1-realm-4.png)

#### Create client

![](/images/sso/2-client-creation-1.png)

![](/images/sso/2-client-creation-2.png)

![](/images/sso/2-client-creation-3.png)

![](/images/sso/2-client-creation-4.png)

#### Configure client

![](/images/sso/3-client-settings-1.png)

![](/images/sso/3-client-settings-2.png)

![](/images/sso/3-client-settings-3.png)

![](/images/sso/3-client-settings-4.png)

![](/images/sso/3-client-settings-5.png)

![](/images/sso/3-client-settings-6.png)

#### Configure client roles

![](/images/sso/4-client-roles-1.png)

![](/images/sso/4-client-roles-2.png)

![](/images/sso/4-client-roles-3.png)

![](/images/sso/4-client-roles-4.png)

#### Add a user

![](/images/sso/5-user-creation-1.png)

![](/images/sso/5-user-creation-2.png)

#### Configure user roles

![](/images/sso/6-user-roles-1.png)

![](/images/sso/6-user-roles-2.png)

#### Get links

![](/images/sso/7-links-1.png)

![](/images/sso/7-links-2.png)

## Setting up InAppStory console

### Configure SSO

![](/images/sso/8-console-1.png)

![](/images/sso/8-console-2.png)

![](/images/sso/8-console-3.png)

![](/images/sso/8-console-4.png)

![](/images/sso/8-console-5.png)

The "Users list URL" and "User roles URL" 
are used to synchronize user access roles.

#### For Keycloak

```
http://your-keycloak-host.tld/admin/realms/inappstory-sso/users
http://your-keycloak-host.tld/admin/realms/inappstory-sso/users/{userId}/role-mappings
```

# Setting up user access roles

## Change user access roles

Изменить роли доступа пользователя в своем сервисе 
учётных записей пользователей. 

### For Keycloak

![](/images/sso/6-user-roles-1.png)

![](/images/sso/6-user-roles-2.png)

## Synchronize user access roles

![](/images/sso/9-console-sync-1.png)