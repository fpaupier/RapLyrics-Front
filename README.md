# RapLyrics Front End

<p align="center"> 
<a href="https://raplyrics.eu">

![lyrics generation](/doc/lyrics_sample.gif)
</a>
</p>

## Context 
This repository contains the assets used for the front-end
of the `raplyrics` web-app available at [raplyrics.eu](https://www.raplyrics.eu/?utm_source=github.com&utm_medium=github-readme&utm_campaign=github-front).

This project consumes a lyric generative web-app served with ``gunicorn``.

## References 
Learn more on how we built the data pipeline including the scraping of lyrics, the training of a state of the art
text-generative model and the serving of a `tensorflow` model through `gunicorn` by checking our related repositories:

- Scraping lyrics and pre-processing utilities [RapLyrics-Scraper](https://github.com/fpaupier/RapLyrics-Scraper) 
- Training and serving a model [RapLyrics-Back](https://github.com/cyrilou242/RapLyrics-Back)

## Protips
You want to test some models using our front-end? Easy!
To do so, simply change the callback settings in the `index.html` file.

From:
 ```js
var settings = {"async": true,
                "ur":"https://raplyrics.eu/apiUS",
                ...,
                }
```
to:
 ```js
var settings = {"async": true,
                "ur":"http://127.0.0.1:5000/myAPIEndPoint",
                ...,
                }
```
with your correct localhost address and API endpoint set of course.
