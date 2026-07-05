# SSL Pinning

If you want to use SSL Pinning in your project, you need to add next line to your Application tag AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest>
    <application 
        android:networkSecurityConfig="@xml/network_security_config">
        ...
    </application>
</manifest>
```

And add network_security_config.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">inappstory.com</domain>
        <pin-set>
            <pin digest="SHA-256">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX=</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```
