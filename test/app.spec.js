import App from "../scripts/models/app.js";
import StoryMetadata from "../scripts/models/story-metadata.js";
import Story from "../scripts/models/story.js";
import appStorage from "../scripts/models/app-storage.js";

describe("app model", async () => {
  it("should initialize with default arguments", async () => {
    let app = new App();
    expect(app).toHaveProperty("stories");
    expect(app.stories).toHaveLength(1);
    expect(app.stories[0]).toBeInstanceOf(StoryMetadata);
    expect(app).toHaveProperty("selectedStoryIndex", 0);
    expect(app).toHaveProperty("selectedStoryIndex", 0);
  });

  it("should initialize with supplied arguments", async () => {
    let app = new App({
      stories: [
        { name: "Foo Story" },
        { name: "Bar Story" },
        { name: "Baz Story" },
      ],
      selectedStoryIndex: 1,
    });
    await app.loadSelectedStory();
    expect(app).toHaveProperty("stories");
    expect(app.stories).toHaveLength(3);
    expect(app.stories[0]).toBeInstanceOf(StoryMetadata);
    expect(app.stories[0]).toHaveProperty("name", "Foo Story");
    expect(app).toHaveProperty("selectedStoryIndex", 1);
    expect(app.selectedStory).toBeInstanceOf(Story);
  });

  it("should select story", async () => {
    let app = new App({
      stories: [
        { name: "Foo Story" },
        { name: "Bar Story" },
        { name: "Baz Story" },
        { name: "Last Story" },
      ],
    });
    await app.loadSelectedStory();
    expect(app).toHaveProperty("selectedStoryIndex", 0);
    await app.selectStory(2);
    expect(app).toHaveProperty("selectedStoryIndex", 2);
  });

  it("should load story data when selecting story", async () => {
    let app = new App({
      stories: [
        { name: "Foo Story" },
        { name: "Bar Story" },
        { name: "Baz Story" },
        { name: "Last Story" },
      ],
    });
    await app.loadSelectedStory();
    expect(app).toHaveProperty("selectedStoryIndex", 0);
    await app.selectStory(2);
    expect(app.selectedStory).toBeInstanceOf(Story);
    expect(app.selectedStory).toHaveProperty("metadata");
    expect(app.selectedStory.metadata).toEqual(app.stories[2]);
  });

  it("should get selected story metadata", async () => {
    let app = new App({
      stories: [{}, {}, {}],
      selectedStoryIndex: 1,
    });
    await app.loadSelectedStory();
    expect(app.getSelectedStoryMetadata()).toEqual(app.stories[1]);
  });

  it("should get selected story metadata", async () => {
    let app = new App({
      stories: [
        { name: "Foo Story" },
        { name: "Bar Story" },
        { name: "Baz Story" },
      ],
      selectedStoryIndex: 1,
    });
    await app.loadSelectedStory();
    expect(await app.getSelectedStoryName()).toEqual("Bar Story");
  });

  it("should rename selected story", async () => {
    let app = new App({
      stories: [
        { name: "Foo Story" },
        { name: "Bar Story" },
        { name: "Baz Story" },
      ],
      selectedStoryIndex: 1,
    });
    await app.loadSelectedStory();
    await app.renameSelectedStory("Story Reborn");
    expect(app.stories[1].name).toEqual("Story Reborn");
  });

  it("should delete selected story", async () => {
    let app = new App({
      stories: [
        { name: "Foo Story" },
        { name: "Bar Story" },
        { name: "Baz Story" },
      ],
      selectedStoryIndex: 1,
    });
    await app.loadSelectedStory();
    await app.deleteSelectedStory();
    expect(app.stories).toHaveLength(2);
    expect(app.stories[0].name).toEqual("Foo Story");
    expect(app.stories[1].name).toEqual("Baz Story");
  });

  it("should delete the only story by replacing it", async () => {
    let app = new App({
      stories: [{ name: "Foo Story", createdDate: Date.now() }],
    });
    await app.loadSelectedStory();
    await app.deleteSelectedStory();
    expect(app.stories[0]).toHaveProperty("name", "My First Story");
  });

  it("should create new story", async () => {
    let app = new App();
    let defaultStory = app.stories[0];
    await app.createNewStoryWithName("My New Story");
    expect(app.stories).toHaveLength(2);
    expect(app.selectedStoryIndex).toEqual(0);
    expect(app.stories[0]).not.toEqual(defaultStory);
    expect(app.stories[1]).toEqual(defaultStory);
  });

  it("should add existing story", async () => {
    let app = new App();
    let story = new Story({
      frames: [{}, {}],
      selectedFrameIndex: 1,
      frameDuration: 125,
      metadata: {
        name: "My Test Story",
        createdDate: Date.now(),
      },
    });
    let defaultStory = app.stories[0];
    await app.addExistingStory(story);
    expect(app.stories).toHaveLength(2);
    expect(app.selectedStoryIndex).toEqual(0);
    expect(app.selectedStory.frameDuration).toEqual(story.frameDuration);
    expect(app.stories[0]).not.toEqual(defaultStory);
    expect(app.stories[1]).toEqual(defaultStory);
  });

  it("should export JSON", async () => {
    let json = new App().toJSON();
    expect(json).toHaveProperty("stories");
    expect(json).toHaveProperty("selectedStoryIndex");
  });

  it("should save", async () => {
    let app = new App({
      stories: [
        { name: "Foo Story" },
        { name: "Bar Story" },
        { name: "Baz Story" },
      ],
      selectedStoryIndex: 1,
    });
    await app.loadSelectedStory();
    let key = "flipbook-manifest";
    await appStorage.remove(key);
    await app.save();
    expect(JSON.stringify(await appStorage.get(key))).toEqual(
      JSON.stringify(app),
    );
  });

  it("should do nothing if nothing to restore", async () => {
    await appStorage.remove("flipbook-manifest");
    let app = await App.restore();
    expect(app).toHaveProperty("stories");
    expect(app.stories).toHaveLength(1);
    expect(app.selectedStoryIndex).toEqual(0);
    expect(app.stories[0].name).toEqual("My First Story");
    expect(app.selectedStory.metadata.name).toEqual("My First Story");
  });

  it("should restore persisted app data", async () => {
    await appStorage.set("flipbook-manifest", {
      stories: [
        { name: "Foo", createdDate: Date.now() },
        { name: "Bar", createdDate: Date.now() + 10 },
        { name: "Baz", createdDate: Date.now() + 20 },
      ],
      selectedStoryIndex: 1,
    });
    let app = await App.restore();
    expect(app).toHaveProperty("stories");
    expect(app.stories).toHaveLength(3);
    expect(app.selectedStoryIndex).toEqual(1);
    expect(app.stories[0].name).toEqual("Foo");
    expect(app.stories[1].name).toEqual("Bar");
    expect(app.stories[2].name).toEqual("Baz");
  });

  it("should save immediately if app is created from scratch", async () => {
    await appStorage.remove("flipbook-manifest");
    await App.restore();
    expect(await appStorage.get("flipbook-manifest")).not.toBeNull();
  });
});
