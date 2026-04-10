const mineflayer = require("mineflayer");
const { pathfinder, goals } = require("mineflayer-pathfinder");
const express = require("express");

const app = express();
app.get("/", (req, res) => res.send("Bot is alive"));
app.listen(3000, () => console.log("🌐 Web server started"));

function createBot() {
  const bot = mineflayer.createBot({
    host: "rez1-SYkl.aternos.me",
    port: 11149,
    username: "SleepBot",
  });

  bot.loadPlugin(pathfinder);

  bot.once("spawn", () => {
    console.log("✅ Bot joined");

    setInterval(() => smartSleep(bot), 10000);

    setInterval(() => {
      if (bot.entity) {
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 500);
      }
    }, 30000);
  });

  bot.on("end", () => {
    console.log("🔄 Reconnecting...");
    setTimeout(createBot, 10000);
  });

  bot.on("error", (err) => console.log(err));
}

async function smartSleep(bot) {
  if (!bot.time.isNight) return;

  console.log("🌙 Night!");

  const bed = bot.findBlock({
    matching: (block) => bot.isABed(block),
    maxDistance: 20,
  });

  if (!bed) {
    console.log("❌ No bed");
    return;
  }

  const goal = new goals.GoalBlock(
    bed.position.x,
    bed.position.y,
    bed.position.z,
  );

  bot.pathfinder.setGoal(goal);

  setTimeout(async () => {
    try {
      await bot.sleep(bed);
      console.log("😴 Sleeping");
    } catch (err) {
      console.log(err.message);
    }
  }, 5000);
}

createBot();
