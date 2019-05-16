---
layout: post
title: PlateZero Update, Mid May 2019
categories: update
---

Greetings! It's time for another update on what's been cooking here at
PlateZero.

We currently have 42 registered users, up from 22 as of our previous
update. To those of you who are new, welcome! We gained most of our new
users through a post on Reddit, and we'll continue to share improvements
and features with folks there. If you know of any other great places to
share PlateZero, please let us know.

PlateZero Blog
------------------------------------------------------------------------

We have a new blog set up! Check out <https://blog.platezero.com>.
There's also an RSS feed, so if that's your thing, you can subscribe to
<https://blog.platezero.com/feed.xml>.

For now, we plan to continue sending an email update every other week
and cross-posting it on the blog, but our plans may evolve as we grow.
In particular, we'd like to start posting additional, smaller updates on
the blog while we keep these email updates more high-level.

Development Updates
------------------------------------------------------------------------

* Plain-text export

  We've started the process of providing a clean way to export your
  recipes from PlateZero. While we think PlateZero is the best home your
  recipes could have, we want to make sure you have complete control
  over everything you add to your PlateZero account, including moving
  them somewhere else, or simply backing them up to your computer.

  Right now, you can add `.txt` to the end of the URL for any of your
  recipes to see a plain-text version. For example, the recipe I have
  for apple butter at

      <https://platezero.com/bb/apple-butter>

  can be viewed as plain text by going to

      <https://platezero.com/bb/apple-butter.txt>

  We have plans to add support for additional formats in the coming
  future, as well as adding an "export everything" button. If you have
  specific exporting needs, please drop us a line!

* Recipe notes

  We're very excited to announce the ability to add notes to your
  recipes! This is something I've personally been really looking forward
  to for a while. Now, when you cook something delicious, there's a
  great place to capture things you want to remember next time like I've
  done here on my recipe for Baba Ghanoush:
  <https://platezero.com/bb/baba-ghanoush>

  When you add a note, we remember which version of the recipe you wrote
  it on so that as you iterate, notes from older versions will be hidden
  by default. You can also pin notes to the top of the recipe, so you'll
  always see them right away (until you un-pin them anyway).

  Let us know what you think!

* Share sheet and print button

  PlateZero has always had great support for printing and sharing
  recipes. Each recipe is accessible through its URL and that can be
  shared with anyone. The recipe page, when printed, auto-formats itself
  to smart defaults so you get a crisp clean printed recipe. We've added
  buttons to make these amazing features more accessible. Start sharing!

* Image Proxy

  This is one of the less-visible improvements we've made. On PlateZero,
  you can display externally-hosted images for your recipes. We were
  having two problems with this, however. First, these pictures tend to
  be quite large, resulting in very slow page loads for your list of
  recipes where we were loading the high-res external image but only
  displaying it at a thumbnail size. Second, if the image was not loaded
  from the external source over a secure HTTPS connection, you'd see a
  mixed content warning in your browser.

  To resolve these issues, we've setup an image proxy using
  <https://github.com/willnorris/imageproxy>. The proxy can change image
  size, quality, rotation, and more on the fly. This allows us to shrink
  large images to preserve bandwidth and make the site load faster. It
  also solves the mixed content warnings, since we now load all external
  images through our secure proxy.

* Smaller updates and improvements

    - You can now log out
    - URL importer has been improved for several websites
    - You can now edit your recipes' attribution in the Actions menu

Shoutouts!
------------------------------------------------------------------------

Huge thanks to Dgl2311 for recommending us for credits to use Google's
Vision API! We use this service as part of our recipe image importing
process, and now it'll be free for the foreseeable future.

Thanks as well to brian, davehodg, Dgl2311, hbisthebest25, and Shanzy
for your bug reports and suggestions! If you have any ideas or notice
any problems as you're using PlateZero, we would love to hear about
them. You can send your thoughts by email to <hello@platezero.com>, and
it'll get bounced off to all of us.

You can also enter a ticket directly in our issue tracker by sending
email to <bugs@platezero.com>. While we don't always respond to these,
we definitely read, discuss, and prioritize each message we receive.

                               ~~  ~~  ~~

That's all for now! Enjoy PlateZero, please keep the feedback coming!
We've been having a blast creating something we love having in our
lives, and we hope you are loving it too.

Best,
Ben

P.S. If you do not want to receive future updates about PlateZero, just
let me know and I'll remove you from the list.
