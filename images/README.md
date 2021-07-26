# AutoArchive
AutoArchive is a simple Thunderbird addon that adds a button to mail views.
If pressed the mail is archived to the preconfigured folder.

**AutoArchive runs user provided javascript. You have been warned!** 

## Configuration
The addon can be configured via the options tab. You can also import/export the settings there.
As of now, the only settings are the rules for which mail has to be archived into which folder.

A rules consists of 2 values:
- **path** determines the destination folder for a mail to be archived to. It has the following form: `account_name/path/to/destination/folder`.
  Path supports substitution of the current year: `${year}` is replaced with the current year, e.g. `2021`.
- **selector** is a JS function body that receives `message` as an argument of type [MessageHeader](https://webextension-api.thunderbird.net/en/latest/messages.html#messageheader)
  and returns a `boolean`. The selector function is executed to determine whether a particular mail is affected by a rule.

An example configuration might look like this:
```json
[
    {
        "path": "john.doe@example.com/Archives/${year}/amazon",
        "selector": "return message.author.includes('@amazon.de');"
    },
    {
        "path": "john.doe@example.com/Archives/paypal",
        "selector": "return message.author === '\"service@paypal.de\" <service@paypal.de>';"
    },
    {
        "path": "Local Folders/Trash",
        "selector": "return message.author === 'SpamBot <spam@bot.example>';"
    }
]
```

## FAQ

### Doesn't Thunderbird offer an archiving feature out of the box?
Yes but, as far as I know, it is limited. You can only put your mails into a basic
archive folder split into years. If you want more specialized folders, you're out of luck.

### There is no archiving button on my mail.
Please make sure there is an archiving rule that applies to this mail.

### Why does AutoArchive run user provided javascript? Isn't that totally unsafe?!
Yes it probably is. However the addon is mostly for myself and just passing a JS function as selector was
way easier than implemented some kind of filter system.

## Attributions

[Icon](https://www.flaticon.com/premium-icon/archives_1200551) made by [Freepik](https://www.freepik.com) from [www.flaticon.com](http://www.flaticon.com).
