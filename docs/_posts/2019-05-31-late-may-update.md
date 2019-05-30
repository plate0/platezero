---
layout: post
title: PlateZero Update, Late May 2019
categories: update
---

Greetings, PlateZero! It's been two weeks since our last update, so it's
time to fill you in on what we've been up to.

We've grown to 58 registered users, up from 42 at our last update. To
those of you who are new, welcome! We send out this update every other
Friday to keep you appraised of what we're working on. If you don't want
to get this update, just shoot me an email and I'll remove you from the
list. You can also catch up on our previous updates on our blog:
<https://blog.platezero.com>.

Development Updates
------------------------------------------------------------------------

* Search by ingredients

  Before, the search feature simply looked for a match to your search
  term in the recipes' titles and descriptions. Now, we look into the
  ingredients and instructions, and the results are ranked to show the
  best matches at the top.

* Shopping Lists

  We've added the first big feature outside of managing your recipes:
  shopping lists! You can create lists and add your items to them,
  checking them off as you walk through the store. We just launched this
  and have a lot more planned, so expect to see a lot more added in the
  coming days.  For example, we want your lists to integrate nicely with
  your recipes, so you can add ingredients straight from a recipe you
  want to make.  If you have any specific requests of your own, let us
  know so we can prioritize them!

* Metrics!

  We've spent a lot of the past two weeks working on less user-facing
  improvements. We now have much better visibility into how people are
  using PlateZero so we can understand how the features we're adding
  impact you and affect our growth.

* Smaller updates and improvements

    - Fixed broken link after adding a recipe (thanks to joelea for
      reporting this!)
    - Recipe descriptions now support Markdown. Learn more:
      <https://commonmark.org/help/>
    - You can now add notes from the Actions menu in addition to going
      to the Notes tab
    - More consistent ingredient formatting
    - Better importing support for more websites
    - Improved formatting for instructions

Open Source Recipe Parser/Importer Library
------------------------------------------------------------------------

We've released our second open source library! This is what we use
behind the scenes when you add a recipe from a website. It contains
information on how to extract the recipe from a lot of popular websites
very reliably, and uses a heuristic approach to import recipes from
websites we haven't written specific code for. It also serves as a sort
of framework for easily writing importers for new websites as well.

If you're technically inclined, feel free to take a look and to send us
pull requests to support more sites:
<https://github.com/plate0/recipe-parser>.

Shoutouts!
------------------------------------------------------------------------

Thanks to laurencep and joelea for your feedback!

As always, if you have any thoughts you'd like to share, we would love
to hear about them. You can send them by email to <hello@platezero.com>,
and it'll get bounced off to all of us.

You can also enter a ticket directly in our issue tracker by emailing
<bugs@platezero.com>. While we don't always respond to these, we
definitely read, discuss, and prioritize each message we receive.

                               ~~  ~~  ~~

That's all for now! If you've been finding PlateZero helpful, it'd mean
the world to us if you share it with other folks who you think might
also get some use out of it.

Best,
Ben
