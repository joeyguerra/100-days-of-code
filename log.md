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

## Day 4: November 11, 2021

**Today's Progress** Evolved code to use a mixture of event sourcing and MVC.

**Thoughts:** Had a conversation this morning about Event Sourcing in the context of how I implemented it yesterday. The consensus is the DOM events are too low level to use for Event Sourcing. They aren't domain level events. So I refactored the code to convey domain level events. But I still like the reactivity and code cohesion characteristics of the MVC communication structure, so I implemented both, MVC and Event Sourcing.

We also talked about the difference between a Command and Event. Anyone can tell me what to do. But the decision to or not to do is up to me, a sovereign entity. So when someone clicks the delete button, they are essentially requesting the app to delete the item. But it's up to the app to decide what to do with that request. Of course, it'll delete the item, but there's a distinct separation of ownership that results in even more flexible code in that the concerns are very clear in the code. In short, it makes for a more flexible codebase and application.

One really cool quality of implementing Event Sourcing at a domain level is we have a log of events that look like this:

```
0 SubmitNewItemRequest {item: "testing", id: 1636687483872, timestamp: 1636687483872}
1 ItemWasAdded {item: "testing", id: 1636687483872, timestamp: 1636687483873}
2 SubmitNewItemRequest {item: "new events", id: 1636687485586, timestamp: 1636687485586}
3 ItemWasAdded {item: "new events", id: 1636687485586, timestamp: 1636687485586}
4 SubmitNewItemRequest {item: "remove", id: 1636687486662, timestamp: 1636687486662}
5 ItemWasAdded {item: "remove", id: 1636687486662, timestamp: 1636687486663}
6 SubmitNewItemRequest {item: "deltee", id: 1636687487583, timestamp: 1636687487583}
7 ItemWasAdded {item: "deltee", id: 1636687487583, timestamp: 1636687487584}
8 DeleteItemRequest {id: 1636687486662, timestamp: 1636687488929}
9 ItemWasDeleted {item: undefined, id: 1636687486662, timestamp: 1636687488930}
10 SubmitNewItemRequest {item: "new one", id: 1636687491052, timestamp: 1636687491052}
11 ItemWasAdded {item: "new one", id: 1636687491052, timestamp: 1636687491053}
12 SubmitNewItemRequest {item: "back and forth", id: 1636687493411, timestamp: 1636687493411}
13 ItemWasAdded {item: "back and forth", id: 1636687493411, timestamp: 1636687493412}
```

which can be used to re-create the state of the app at any time. And I know precisely whats happened.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/)

## Day 5: November 12, 2021

**Today's Progress** The only thing I did was think about building an e-commerce site. I read over the Mozilla Developer docs for HTML. Thought about using Schema.org for marking up the product HTML, or using microformats for a hot second.

**Thoughts:** It's hard to keep momentum going without a concrete idea to work on.

**Link to work:**

- [Mozilla Dev Docs](https://developer.mozilla.org/en-US/docs/Learn/HTML/)
- [Schema.org](https://schema.org)
- [Microformat](https://developer.mozilla.org/en-US/docs/Web/HTML/microformats)

## Day 6: November 13, 2021

**Today's Progress** Added some products. Styled the main page and product listing. Created a new file for stuff todos code. Added a nav.

**Thoughts:** Just start. I'm building an e-commerce page. I thought I'd help out the Black Girls Code organization by linking to their Bonfire products.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/)

## Day 7: November 14, 2021

**Today's Progress** Started a search view.

**Thoughts:** Building the ability to find products based on a search term.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/)

## Day 8: November 15, 2021

**Today's Progress** Implement naive search functionality.

**Thoughts:** There's lots of scenarios to consider for the search functionality. i.e. what happens when the person clicks buy, and then the back button? Sould the page remember their search results and search term?.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/)

## Day 9: November 16, 2021

**Today's Progress** Skipped it. Kids school activity.

**Thoughts:** Some things are more important.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/)

## Day 10: November 17, 2021

**Today's Progress**

- Practice TDD
- Built a static web server

**Thoughts:** Practicing TDD is refreshing. I code fearlessly. Also, was having a conversation about this morning about how coding in React is nice because it enables organizing the code in folders as components and modules. So I wanted to figure out how to enable that without a framework. Which means I can no longer go without using a webserver. So I built one.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/)

## Day 11: November 18, 2021

**Today's Progress**

- Build screen shot with capture api

**Thoughts:** I want to see what the user sees when they run into an error. So I'm going to provide a "submit error" button so the user can click on it and I can get a screen shot of the web app at the time of the error.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/videoshenanigans.html)

## Day 12: November 19, 2021

**Today's Progress**

- Screen shot just the browser window

**Thoughts:** Safari doesn't allow you to pick or set what gets screen shared, it's all or nothing. So I wrote code to crop the image.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/videoshenanigans.html)

## Day 13: November 26, 2021

**Today's Progress**

- Decided to build a photo collage builder
- Build multi image uploader
- Crop images to a specified size
- Add to a canvas object

**Thoughts:** I want to build a photo collage for a Christmas card.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/collage.html)

## Day 14: November 29, 2021

**Today's Progress**

- Make separate html elements for each photo


**Thoughts:** I want to pick where photo goes in the collage.

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/collage.html)

## Day 15: Dec 2, 2021

**Today's Progress**

- Explore dragging and dropping an image


**Thoughts:** How am I going to figure out where to drop the image in the list?

**Link to work:**

- [Github Pages](https://joeyguerra.github.io/100-days-of-code/collage.html)

## Day 16: Dec 5, 2021

**Today's Progress**

- Implement Event Sourcing system
- Practice TDD
- Organize code into a domain called Inventory

**Thoughts:** I'm building an event sourced system at work in C#. So I wanted to do it in Javascript just to explore some ideas and semantics. Words mean something. And we choose words derived from our biases and experiences. But the meanings of those words in code are not usually universal. What I mean is when your future self or other people read the code, they won't interpret it as you intended.

A way to mitigate this issue is to use words and semantics which come from research, books, the industry or community at large. So that the probability is higher other people will have similar biases and experiences, resulting in them interpreting the code as you intended.

**Link to work:**

- [Github Pages](https://github.com/joeyguerra/100-days-of-code/blob/main/examples/EventSourcing.mjs)

## Day 17: Dec 10, 2021

**Today's Progress**

- Process commands
- Build a view

**Thoughts:** It's hard for me to be consistent with this because I'm coding all day already. But if it's ok to skip days, I can keep going.

**Link to work:**

- [Github Pages](https://github.com/joeyguerra/100-days-of-code/blob/main/examples/EventSourcing.mjs)

## Day 18: Dec 11, 2021

**Today's Progress**

- Flush out view builders
- Restart and Keep it Simple Stupid

**Thoughts:** I'm getting lost. So I think I'll restart and just stick to the 3 functions.

**Link to work:**

- [Github Pages](https://github.com/joeyguerra/100-days-of-code/blob/main/examples/EventSourcingKISS.mjs)
