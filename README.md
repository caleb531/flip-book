# Flip Book

*Copyright 2018 Caleb Evans*  
*Released under the MIT license*  
*For my friend and brother, Bill.*

This application enables you to create flip book-style animations to share with
friends.

You can view the app online at:  
https://projects.calebevans.me/flip-book/

## How to use

### Creating your story

When you open Flip Book for the first time, you are presented with a blank
canvas which represents the current frame of your animation/story. Below the
canvas are your editor controls, where you can add new frames and play your
story, among other things.

The first thing you'll want to do is begin drawing the first frame of your story
on the blank canvas. Click the plus (+) icon to add the next frame when you are
content with your current frame. You can always jump to any past or future frame
using the timeline strip in the bottom editor toolbar.

### Fixing your drawings

The Undo/Redo buttons on the right side of the toolbar allow you to undo or redo
changes you make to the current drawing. Please note that at the time being, the
undo/redo behavior is per-frame, and it cannot undo frame deletions.

### Playing your story

When you would like to see your story in action, click the Play icon to play the
animation starting at the current frame. For convenience, you can click the
"Skip To First Frame" button to the left of the Play icon to start your
animation at the beginning before playing it.

### Saving your story

When you are finished with your animation and would like to share it, click the
Export icon towards the left side of the toolbar. In the panel that appears,
choose "Export to GIF" and your animation will be automagically converted to a
GIF that you can download.

## Creating another story

Click the folder icon in the top-left of the editor view, and you can view all
of the stories you've created. Click the plus (+) icon in that open panel to
create a new story. You can have as many stories as you want.

To delete a story, select a story in the list and click the trash can icon in
the top-right corner of the editor. To rename a story, click the pencil icon
next to the story's name.

## Importing a project

You can also import a project that you have downloaded via the "Export Project"
button. To do so, click the up-arrow icon near the top-left corner of the
editor.

## Setup

```bash
npm install
gulp build:watch
```
