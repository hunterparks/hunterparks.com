+++
date = "2017-05-08"
title = "Backing up Files to Backblaze B2 with Rclone"
tags = [ "backup" ]
#categories = []
#series = []
#featured_image = "https://imgs.xkcd.com/comics/angular_momentum.jpg"
+++

Backing up files is arguably one of the most important things someone can do on their computer. Ensuring there is a copy of your most important data affords you the ability to not worry about a future ransomware virus, a stolen/broken computer, or just a simple accident that could erase your information forever.

A strategy that is widely seen as a very effective way to backup your data is the 3-2-1 Backup Rules/Best Practices:

{{< figure src="/images/321.png" caption="The 3-2-1 Backup Rules/Best Practices" >}}

With the following guide, I hope to be able to have an additional copy of my data, stored on a different storage type, and synced with a cloud service provider - Backblaze in this case.

# Preparing the Hardware (optional) #

If you already have a computer setup, please skip this step. If not, see the list of hardware I used for this project - found below:

* Raspberry Pi 3 Model B
* Raspberry PI Case
* SD Card
* Internal Hard Drive
* External Hard Drive Enclosure

**Note**: If you do not have an extra hard drive sitting around, you can purchase external drive instead.

# Preparing the Computer #

The only prerequisite for the computer is that you have Windows, macOS, or Linux installed and functioning. Plug in your external hard drive and make sure that it is functioning correctly. Additionally, ensure that you have an active internet connection as that will be required for installing the necessary software and uploading your files to Backblaze B2 for backup.

# Backing up Your Files #

### Step 1 - Set Up a Backblaze B2 Account ###

While Rclone supports many different cloud providers (see their website [here](https://rclone.org/overview/)), I will be using [B2](https://www.backblaze.com/b2/cloud-storage.html) from [Backblaze](https://www.backblaze.com/). Follow the instructions on the B2 website to setup your B2 account and get your API key - this key will allow you to access you B2 account through Rclone.

### Step 2 - Install Rclone ###

Rclone will need to be installed on the computer you are using to store your files. If you are not using the same hardware I am, please install the Rclone version that will work for your computer. Visit the Rclone [downloads](https://rclone.org/downloads/) page to find the installer for your computer. If you are following my hardware choice, select the ARM - 32 Bit installer. Finally, follow the [installation instructions](https://rclone.org/install/) on the Rclone website to *properly* install Rclone on your computer.

### Step 3 - Connect Rclone to Backblaze B2 ###

1. Run `rclone config`.
2. Press `n` to create a new remote.
3. Specify a name to reference this remote in commands. For my purposes, I chose `remote`.
4. Press `2` then hit `enter` to select Backblaze B2.
5. Enter your Backblaze Account ID then hit `enter`.
<span class="caption text-muted" style="text-align: left;">This will look something like `123456789abc`.</span>
6. Enter your Backblaze Application Key then hit `enter`.
<span class="caption text-muted" style="text-align: left;">This will look something like `0123456789abcdef0123456789abcdef0123456789`.</span>
7. Leave Endpoint blank then hit `enter`.
8. Press `y` then hit `enter` to save configuration.

For more information, please visit the [Rclone B2](https://rclone.org/b2/) website.

### Step 4 - Configure Encryption in Rclone ###

1. Run `rclone config`.
2. Press `n` to create an encrypted container.
3. Specify a name to reference this container in commands. For my purposes, I chose `secret`.
4. Press `5` then hit `enter` to select crypt.
5. Enter `<REMOTE_NAME>:<B2_BUCKET_NAME>` then hit `enter` to select the previously made remote.
<span class="caption text-muted" style="text-align: left;">For my purpose, this is `remote:backup` where `backup` is the name of my B2 bucket.</span>
6. Type `standard` for encrypted file names.
7. Choose a passphrase or generate one.
<span class="caption text-muted" style="text-align: left;">It is important that you remember your passphrase - you will not be able to decrypt your backups without it.</span>
8. Choose a salt or generate one.
<span class="caption text-muted" style="text-align: left;">It is important that you remember your salt - you will not be able to decrypt your backups without it.</span>
9. Press `y` to confirm the configuration and press `q` to close Rclone.

### Step 5 - Backing up Your Files ###

Now, when wanting to backup a folder to BackBlaze, type the following command:

~~~
rclone sync /path/to/folder secret:
~~~

This line takes all of your files in the folder path and uploads them to your Backblaze B2 bucket. For me, I write the following line:

~~~
rclone sync Backup/ secret
~~~

<b>Note</b>: There are two options for uploading to the cloud. While I use `sync`, you can also use `copy`. Here are the differences:
* `Sync` will mirror the folder path exactly from your local filesystem to Backblaze. This deletes files in the destination that have been removed from the source.
* `Copy` will copy files from your local filesystem to Backblaze where deleted files will NOT be deleted from Backblaze.

If you have a lot of files to upload that could take a long time, use the following command so that output is recorded to a file and the upload will not get killed if you log out:

~~~
setsid [command] --log-file /path/to/file.log &>/dev/null
~~~
where `[command]` is the command you used above.

### Step 6 - Backup Automation ###

The following set of commands will setup your computer to run an automatic backup of your files.

1. Run `crontab -e`
2. At the end of the file, add the following command:

~~~
0 * * * * /usr/bin/setsid /usr/sbin/rclone sync /path/to/folder secret: &>/dev/null
~~~

3. Save and exit your crontab file.

**Note**: You can add an output log file by using the `--log-file` parameter found in step 5. Additionally, you can also choose between the `sync` and `copy` rclone modes.

### Step 7 - Restoring Your Files ###

To obtain you files from Backblaze, you will need to configure rclone on a new machine or you will need to move to a different location of your uploading computer. It can be helpful to backup you configuration files to make it easier to restore. Once your configuration is correct, run the following command:

~~~
rclone sync secret: /path/to/folder
~~~

<hr>

### That's it! ###

Your files are now being securely backed up to the cloud!

Big shoutout to [defectivebit](https://gist.github.com/defectivebit) on GitHub who wrote [this](https://gist.github.com/defectivebit/95b159ed5ba7e1d5d85d74c6e4b04dea) awesome Gist that helped guide me on getting my backup setup.