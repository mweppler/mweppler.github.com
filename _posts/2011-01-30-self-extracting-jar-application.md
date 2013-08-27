---
layout: post
meta-description:
meta-keywords: self extracting jar, encryption, project, java
preview: |
  About a year ago, a client of mine needed to send sensitive files over the internet. They wanted something simple enough that the recipient wouldn't need any special software installed to access the files.
tags: [encryption, project, java]
title: Self Extracting Jar Application
---
# Self Extracting Jar Application

About a year ago, a client of mine needed to send sensitive files over the internet. They wanted something simple enough that the recipient wouldn't need any special software installed to access the files. I started working on a java app that would be contained in an executable jar file. It worked as expected and they were happy. I’ve fixed it up a little more and decided to make the application along with the source available.

Details of the app are:

The sender simply double clicks on the jar file (SelfExtractingJar.jar), supplies an Encryption key or Password, and selects a file from the file system. Deliver the newly created \*.jar file and the encryption key anyway they like. The recipient double clicks on the encrypted .jar file, supplies the encryption key and a directory to decrypt/extract. The application cleans up after itself and closes.

Below are links the the application itself and the public github repo.

You can grab the app <a href="http://goo.gl/qjy4m" target="_blank" title="SelfExtractingJar.jar on dropbox">SelfExtractingJar.jar</a> from dropbox.

If youre a developer and would like to checkout or contribute to the project, its hosted on <a href="http://goo.gl/8edPo" target="_blank" title="Link to SelfExtractingJar on GitHub"></a>
