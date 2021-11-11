# 100 Days Of Code - Log

## My Story

I started learning web development in 1995. I was working for Loral Space Communications at NASA/JSC. Lured by the promise of the WWW, my journey started by viewing source with the Netscape browser on my PowerPC 7500 Mac, up at all hours of the night (btw, Apple built a browser called CyberDog ;). As I pulled that thread, I learned HTML -> CSS -> Javascript -> Browsers -> Perl -> Berkley DB -> UNIX -> DNS -> TCP -> HTTP -> Networking -> Credit Card processing -> MySQL -> PHP -> ASP -> ASP.Net -> Windows -> IIS -> Apache -> ... and I continue to pull on that thread. It's neverending.

Fast forward to today, I see myself in everyone who is trying to learn how to code, make a better life for themselves, and just pursuing a dream. It's really inspiring and it reminds me how faw I've come, as well as how hard things can be.

So much has changed in web development since 1995. I thought I'd jump in and join this community to explore the current capabilities of the Browser and the web, as well as to reminisce about how things used to be, revisit the problems we had over the years and see what tools, if any, we don't need because the ecosystem has evolved.

To be honest, I really don't know if I'll be able to stay consistent. But I'll try my best.

## Day 0: November 7, 2021

**Today's Progress**: Created index.html page, forked repo, merged existing files, created an html form, decided to use double quotes in js.

**Thoughts:** I'm reminded how hard it is to learn how to code because the setup can be complicated. I tried just double clicking on an HTML file and loading a javascript module, but was immediately blocked by the browser trying to keep me safe by applying the CORS. I'll just code in the HTML first. I'll let the future Joey G deal with CORS and code organization. Funny how often we do this to our future self. It helps to get gewd at balancing this.

**Link to work:** [The Git Repo](https://github.com/joeyguerra/100-days-of-code)

## Day 1: November 8, 2021

**Today's Progress**: 

**Thoughts:** Decided to create a todo list, but not a todo list. We'll see how it ends up. I implemented the MVC pattern. Controller, View and Model. Created KeyValueObservable for the object communication strategy. When I first started learning Javascript, I did NOT start here. I was more concerned with the Javascript language itself and the Document Object Model (DOM) differences between Browsers. Ugh. Creating my own facade to provide a common API for DOM manipulation across the different browsers took up most of my time. QueySelect didn't exist back then, but I could use IDs and getElementById instead to be honest which is what I often did.

Today I tried using a Proxy for the observable code, but I couldn't find a way to add the observe method to it. So I leveraged Reflect to define properties on the class which traps the getting and setting calls on the object, allowing for observer notifications. 

**Link to work:** [The Git Repo](https://github.com/joeyguerra/100-days-of-code)

## Day 2: November 9, 2021

**Today's Progress**

- Setup Github pages
- Setup a Github Workflow
- Read the MVC articles
- Refactored the MVC codebase to figure out how objects would communicate with each other

**Thoughts:** It's facinating to me how just implementing code as it's described in the MVC paper works really well. I also noticed how the data flow is one direction if you write the code as described in the paper.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/)
- [MVC XEROX PARC 1978-79](https://folk.universitetetioslo.no/trygver/themes/mvc/mvc-index.html)

## Day 3: November 10, 2021

**Today's Progress** Trying to implement Event Sourcing instead of MVC.

**Thoughts:** My colleagues have implemented an Event Sourced system and I'm trying to understand it. So I figured I would implement Event Sourcing on the client side to see how it would work out. There seems to be less code. But I'm curious how this scales because I'm having to write some weird conditionals and there's so many events been stored in the events array.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/)
