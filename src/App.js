import { useMemo, useState } from "react";
import { articles } from "./articles";
import "./styles.css";
import PortfolioBuilder from "./PortfolioBuilder";

const R2_ARCHIVE_BASE_URL =
  "https://pub-a024e35ba283482991012a3182881c0c.r2.dev/articles";

/*
 * GameRant URLs sometimes appear with or without a final slash. Normalizing
 * them here ensures both versions point to the same preserved article.
 */
function normalizeArticleUrl(url) {
  const trimmedUrl = url.trim();
  return trimmedUrl.endsWith("/") ? trimmedUrl : `${trimmedUrl}/`;
}

/*
 * These are the five preserved HTML files currently uploaded to Cloudflare R2.
 * Matching by the original article URL is more reliable than trying to rebuild
 * the saved filename from a title that may contain changed punctuation.
 */
const uploadedArchiveFilesByUrl = new Map([
  [
    normalizeArticleUrl(
      "https://gamerant.com/disney-dreamlight-valley-food-tier-list/"
    ),
    "2025-07-07_Disney-Dreamlight-Valley-Food-Tier-List.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/mario-kart-world-young-pauline-donkey-kong-bananza-dlc-prediction/"
    ),
    "2025-07-06_Mario-Kart-Worlds-First-DLC-Character-May-Be-as-Plain-as-the-Mustache-on-Marios-Face.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-new-horizons-switch-2-quality-of-life-improvements/"
    ),
    "2025-07-02_Whenever-Animal-Crossing-New-Horizons-Switch-2-Successor-Shows-Itself-One-Feature-Has-to-Be-Front-and-Center.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-season-3-skins-leaked-confirmed-klyntar-phoenix-symbiote/"
    ),
    "2025-07-01_Marvel-Rivals-All-Leaked-and-Confirmed-Season-3-Skins-So-Far.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-season-3-leak-jean-grey-daredevil-future-content-teases/"
    ),
    "2025-06-27_If-Marvel-Rivals-Season-3-s-Big-Leak-Proves-True-Players-Have-to-Start-Paying-Closer-Attention-to-One-Feature.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-ftc-refunds-why-qualify-how/"
    ),
    "2025-06-27_Why-Are-Fortnite-Players-Getting-Refunds-and-Do-You-Qualify.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-overwatch-competition-nintendo-switch-2/"
    ),
    "2025-06-21_Marvel-Rivals-Can-t-Keep-Wasting-a-Prime-Opportunity-To-Expand-Its-War-with-Overwatch.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-blade-character-tease-easter-egg-release-when/"
    ),
    "2025-06-19_Marvel-Rivals-is-Keeping-Its-Most-Famous-Gag-Going-But-The-Joke-Already-Stopped-Being-Funny.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-update-season-17-bad-maps-skins-info/"
    ),
    "2025-06-18_Recent-Overwatch-2-Update-Paints-the-Wrong-Picture-of-Season-17.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/league-legends-toxic-new-players-champion-overview-picks-bans/"
    ),
    "2025-06-17_The-Most-Toxic-Game-Out-There-is-Adding-a-Feature-Aimed-Entirely-at-New-Players.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-nintendo-switch-missing-60fps-update-native-port/"
    ),
    "2025-06-17_Overwatch-2-on-Nintendo-Switch-2-is-a-Clear-Step-Forward-But-One-Update-Would-Be-a-Huge-Leap.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/mario-kart-world-peach-toad-voice-actor-changes/"
    ),
    "2025-06-15_Mario-Kart-World-Marks-a-Bittersweet-Chapter-For-Nintendo-Fans.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-tokon-spider-man-suit-design-rivals-similar-different/"
    ),
    "2025-06-13_How-Marvel-Tokon-s-Spider-Man-Design-Compares-to-Marvel-Rivals.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/game-freak-beast-reincarnation-tradition-xbox-no-nintendo-version/"
    ),
    "2025-06-13_Game-Freak-s-Beast-of-Reincarnation-Breaks-a-10-Year-Tradition.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/solo-leveling-arise-overdrive-title-unclear-co-op-new-game/"
    ),
    "2025-06-12_Don-t-Be-Fooled-By-Solo-Leveling-Arise-Overdrive-s-Title.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/invincible-vs-marvel-tokon-spider-verse-graphics-fighting-game-good/"
    ),
    "2025-06-11_The-Most-Exciting-Fighting-Game-For-Spider-Verse-Fans-May-Not-Actually-Be-Marvel-Tokon.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/mario-kart-world-cow-favorite-character-cute-good-why/"
    ),
    "2025-06-07_Mario-Kart-World-s-Fan-Favorite-Character-is-Already-Clear.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-tokon-fighting-souls-marvel-rivals-doctor-doom-best-playable/"
    ),
    "2025-06-06_Marvel-Tokon-Fighting-Souls-is-Beating-Marvel-Rivals-to-the-Punch.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-winston-birthday-is-good-tank-meta/"
    ),
    "2025-06-06_After-Nearly-a-Decade-Winston-Still-Defines-the-Tank-Meta-in-Overwatch.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-tokon-fighting-souls-similar-multiplayer-competitive/"
    ),
    "2025-06-05_How-Marvel-Rivals-and-Marvel-Tokon-Fighting-Souls-are-Two-Sides-of-the-Same-Coin.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-tactics-mode-overwatch-better-why/"
    ),
    "2025-06-05_Marvel-Rivals-Latest-Mode-May-Be-Better-Suited-to-Its-Competition.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-stadium-mode-new-map-wish-list/"
    ),
    "2025-06-02_Overwatch-2-Stadium-Map-Wish-List.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-will-it-be-good-bad-disappointing-expectations/"
    ),
    "2025-06-01_Hollow-Knight-Silksong-Not-Rewriting-the-Book-on-Metroidvanias-Has-to-Be-Okay-If-True.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-marvel-rivals-costume-coin-feature-similar-good/"
    ),
    "2025-05-28_Overwatch-2-Has-Everything-It-Needs-to-Copy-a-Neat-Marvel-Rivals-Feature.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-6v6-playtest-season-16-problem-stadium-focus/"
    ),
    "2025-05-23_Overwatch-2s-6v6-Playtest-Has-One-Hand-Tied-Behind-Its-Back-in-Season-16.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-marvel-rivals-season-3-changes-length/"
    ),
    "2025-05-22_Why-Overwatch-2-Will-Likely-Be-Watching-Marvel-Rivals-Third-Season-Very-Closely.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-season-3-hero-wish-list-blade-gambit-deadpool/"
    ),
    "2025-05-21_Marvel-Rivals-Season-3-Hero-Wish-List.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/damian-wayne-batman-game-improve-talia-al-ghul-why/"
    ),
    "2025-05-19_A-Damian-Wayne-Batman-Game-Would-Have-to-Do-Better-By-One-Key-Character.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-chrono-shield-card-controversy-galactas-gift-explained/"
    ),
    "2025-05-16_Marvel-Rivals-Chrono-Shield-Card-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-season-16-loot-box-problem-15-better/"
    ),
    "2025-05-15_Overwatch-2-Season-16-s-Biggest-Weakness-Was-Season-15-s-Main-Strength.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-mario-spin-offs-similar-good/"
    ),
    "2025-05-10_Animal-Crossing-is-Long-Overdue-the-Mario-Treatment.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-stadium-hero-sojourn-overpowered-broken-unfair/"
    ),
    "2025-05-09_One-Overwatch-2-Stadium-Hero-Could-Be-a-Balancing-Nightmare.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-stadium-roster-competitive-hero-bans/"
    ),
    "2025-05-05_One-Overwatch-2-Competitive-Addition-Could-Make-the-Jump-to-Stadium.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-hero-45-teasers-not-obvious-gladiator-role-why/"
    ),
    "2025-04-29_Overwatch-2-s-New-Hero-Teasers-Aren-t-as-Obvious-as-They-Seem.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-what-to-play-before-release/"
    ),
    "2025-04-29_Hollow-Knight-Silksong-Waiting-Room-Playlist.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-marvel-rivals-skin-gifting-add-feature/"
    ),
    "2025-04-25_Overwatch-2-Should-Hop-on-the-Same-Train-as-Marvel-Rivals-as-Soon-as-Possible.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-stadium-hero-wish-list-tracer-winston-doomfist/"
    ),
    "2025-04-24_Overwatch-2-Stadium-Hero-Wish-List.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-stadium-release-interview/"
    ),
    "2025-04-22_Overwatch-2-s-Team-4-Discuss-Stadium-Heroes-Maps-and-More.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-stadium-core-mode-features-heroes-maps/"
    ),
    "2025-04-21_Stadium-Marks-a-Game-Changing-Shift-for-Overwatch-2.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-stadium-development/"
    ),
    "2025-04-21_The-Vision-Behind-Stadium-How-Overwatch-2-Built-Its-Latest-Game-Mode-from-the-Ground-Up.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-april-22-update-freja-stadium-mode-hero-bans/"
    ),
    "2025-04-14_Why-Overwatch-2-Players-Should-Mark-April-22-on-Their-Calendars.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-le-sserafim-third-collab-male-character-skins-good/"
    ),
    "2025-04-09_If-Overwatch-2-Triples-Down-on-LE-SSERAFIM-Collabs-It-Should-Turn-The-Event-on-Its-Head.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hello-kitty-island-adventure-tamagotchi-plaza-similar-gameplay-characters/"
    ),
    "2025-04-06_Hello-Kitty-Island-Adventure-Fans-Should-Keeps-Tabs-on-Tamagotchi-Plaza.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/2xko-small-launch-roster-future-more-league-of-legends-champions/"
    ),
    "2025-04-02_2XKOs-Small-Launch-Roster-May-Have-a-Silver-Lining.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/tomodachi-life-living-the-dream-animal-crossing-similar-game/"
    ),
    "2025-03-30_Tomodachi-Life-Living-the-Dream-Could-Be-the-Perfect-Stop-Gap-Ahead-of-the-Next-Animal-Crossing.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-mythic-weapon-wish-list-tracer-lucio-venture/"
    ),
    "2025-03-27_Overwatch-2-Mythic-Weapon-Wish-List.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/dc-universe-video-games-new-dcu-superman-movie/"
    ),
    "2025-03-26_Why-DC-Video-Game-Fans-Should-Be-Watching-James-Gunns-Superman-Very-Closely.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-blizzcon-2026-announcements-pve-missions-animated-series/"
    ),
    "2025-03-23_BlizzCon-2026-is-Overwatch-2-Fans-Best-Bet-For-One-Overdue-Form-of-Content.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hello-kitty-island-adventure-minecraft-play-why-dlc/"
    ),
    "2025-03-11_Why-Hello-Kitty-Island-Adventure-Fans-Should-Give-Minecraft-a-Try.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hello-kitty-island-adventure-size-good-animal-crossing-similar/"
    ),
    "2025-03-06_Hello-Kitty-Island-Adventure-Proves-Bigger-May-Be-Better-For-the-Next-Animal-Crossing.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-perks-good-long-term-benefit-updates/"
    ),
    "2025-03-05_Overwatch-2s-Perks-Could-Be-the-Games-Golden-Goose.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-loot-boxes-earn-unlock-more-options-important/"
    ),
    "2025-03-02_Overwatch-2-Cant-Let-Its-Finger-Off-the-Trigger-With-Loot-Boxes.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-dc-clone-bat-family-batman-villains/"
    ),
    "2025-02-27_A-DC-Rivals-Style-Game-Should-Center-Around-Batman-and-His-Iconic-Cast.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-reaper-perks-scrapped-rework-buffs-gameplay-good-why/"
    ),
    "2025-02-25_One-Overwatch-2-Reaper-Perks-Feels-Like-The-Rework-Fans-Have-Been-Waiting-For.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-perk-system-pve-skill-tree-rework/"
    ),
    "2025-02-14_Overwatch-2s-Perk-System-Could-Be-Picking-Up-the-Pieces-of-the-Canceled-PvE-Mode.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-stadium-mode-competition-marvel-rivals-how-third-person/"
    ),
    "2025-02-13_Overwatch-2s-Stadium-Mode-Moves-the-Needle-Ever-Closer-to-a-Major-Competitor.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-next-live-stream-reveal-heroes-good-bad-pros-cons/"
    ),
    "2025-02-11_Overwatch-2-Could-Re-Use-One-Bold-Strategy-With-Its-Next-Heroes-But-Should-It.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-season-1-mid-rank-reset-controversy-explained/"
    ),
    "2025-02-11_Marvel-Rivals-Season-1-Mid-Rank-Reset-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-february-live-stream-possible-pve-animated-series-good-why/"
    ),
    "2025-02-02_Overwatch-2-s-Best-Possible-Surprise-For-February-12-is-Obvious.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-overwatch-2ult-voice-lines-compared/"
    ),
    "2025-02-01_How-Marvel-Rivals-Ult-Voice-Lines-Compare-to-Overwatch-2-s.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-february-spotlight-event-important-future-fate/"
    ),
    "2025-01-31_Why-Overwatch-2-s-February-Spotlight-Event-Could-Be-a-Make-or-Break-Moment.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-maximilien-backstory-lore-omnic-vault-talon/"
    ),
    "2025-01-30_Overwatch-2-Exploring-the-Omnic-Behind-the-Games-New-Vault-Feature.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-new-horizons-start-over-play-again-2025/"
    ),
    "2025-01-29_Animal-Crossing-New-Horizons-Why-You-Should-Start-Over-in-2025.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-stealthy-support-hero-season-16/"
    ),
    "2025-01-26_Overwatch-2-What-Could-a-Stealthy-Support-Play-Like.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-maximilien-possible-new-hero-43-tease/"
    ),
    "2025-01-24_Overwatch-2-May-Be-Hiding-Its-Next-Playable-Hero-in-Plain-Sight.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-clash-dancing-lions-game-mode-lucio-ball-similar/"
    ),
    "2025-01-24_Marvel-Rivals-Clash-of-Dancing-Lions-Game-Mode-Looks-Very-Familiar.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-maximiliens-vault-controversy-skins-selection-bad/"
    ),
    "2025-01-23_Overwatch-2-Maximiliens-Vault-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-battle-pass-theme-wish-list-animal-noir/"
    ),
    "2025-01-21_Overwatch-2-Battle-Pass-Theme-Wish-List.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hello-kitty-island-adventure-platforms-mobile-january-2025/"
    ),
    "2025-01-20_January-30-Is-a-Big-Day-For-Hello-Kitty-Fans.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-overwatch-2-lore-text-story/"
    ),
    "2025-01-19_Marvel-Rivals-Approach-to-One-Feature-is-Something-Overwatch-2-Desperately-Needs.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-mcu-guardians-galaxy-team-comp-good-bad/"
    ),
    "2025-01-19_Would-an-MCU-Guardians-of-the-Galaxy-Team-Comp-Work-in-Marvel-Rivals.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-rumor-professor-x-hero-design/"
    ),
    "2025-01-16_Marvel-Rivals-Would-Need-to-Walk-a-Fine-Line-with-One-Rumored-Characters-Design.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-2025-news-updates-release-trailer/"
    ),
    "2025-01-12_What-to-Expect-From-Hollow-Knight-Silksong-in-2025.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvels-mcu-avengers-movie-team-comp-good-bad-why/"
    ),
    "2025-01-10_Would-an-MCU-Avengers-Team-Comp-Work-in-Marvel-Rivals.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-2025-news-updates-heroes-maps-6v6-themes/"
    ),
    "2025-01-09_What-to-Expect-From-Overwatch-2-in-2025.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-season-15-mercy-genji-relationship-dialogue-more-good/"
    ),
    "2025-01-08_Overwatch-2-Season-15-Has-to-Keep-the-Ball-Rolling-on-One-Character-Dynamic.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-2025-news-major-updates-schedule-resonators/"
    ),
    "2025-01-07_What-to-Expect-From-Wuthering-Waves-in-2025.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-competitive-rank-distribution-gold-peak-why-moon-knight/"
    ),
    "2025-01-05_Marvel-Rivals-Competitive-Rank-Distribution-Has-One-Obvious-Influence.html",
  ],
  [
    normalizeArticleUrl("https://gamerant.com/marvel-rivals-jeff-solo-game/"),
    "2025-01-03_One-Marvel-Rivals-Breakout-Star-Deserves-their-Own-Solo-Game.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-valkyrie-leak-believable-why-thor-loki-hela/"
    ),
    "2025-01-02_Marvel-Rivals-Latest-Leaked-Character-is-a-Logical-Progression.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-bot-lobby-controversy-explained-why/"
    ),
    "2024-12-31_Marvel-Rivals-Bot-Lobby-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-season-0-meta-hela-mantis-doctor-strange-explained/"
    ),
    "2024-12-29_Marvel-Rivals-Season-0-Meta-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-6v6-multiplayer-achievements-good/"
    ),
    "2024-12-23_Overwatch-2-6v6-Could-Fix-a-Problem-for-Trophy-Hunters.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-winter-ltm-jeff-shark-splatoon/"
    ),
    "2024-12-17_Why-Marvel-Rivals-New-Limited-Time-Mode-is-a-Big-Deal.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-meta-character-surprise-jeff-shark-powerful-popular/"
    ),
    "2024-12-12_One-Unexpected-Marvel-Rivals-Character-is-Currently-At-The-Top-of-The-Meta.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-avatar-last-airbender-crossover-what-to-expect/"
    ),
    "2024-12-10_What-to-Expect-From-Overwatch-2-s-Avatar-The-Last-Airbender-Crossover.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-confirmed-twitch-drops-season-0-magneto/"
    ),
    "2024-12-05_All-Marvel-Rivals-Confirmed-Twitch-Drops-So-Far.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/league-legends-animated-shows-ionia-singed-swain-champions/"
    ),
    "2024-12-04_What-to-Expect-From-the-League-of-Legends-Show-s-Ionia.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/league-of-legends-lore-noxus-explained-black-rose-swain-leblanc/"
    ),
    "2024-12-03_The-Lore-of-League-of-Legends-Noxus-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-tank-hazard-omnic-ramattra-relationship-lore-good-why/"
    ),
    "2024-12-02_Hazard-is-Guaranteed-to-Have-Interesting-Interactions-With-Another-Overwatch-2-Tank.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-version-2-0-more-male-resonators-good-why/"
    ),
    "2024-12-01_Wuthering-Waves-Version-2-0-Should-Avoid-One-Massive-Pitfall-From-Version-1-0.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-2-0-features-resonators-rinascita-new-region/"
    ),
    "2024-11-30_What-to-Expect-From-Wuthering-Waves-2-0.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-launch-no-role-lock-queue-why-characters-roster/"
    ),
    "2024-11-28_Why-Marvel-Rivals-Pulling-the-Trigger-on-Role-Queue-May-Be-a-Tough-Ask.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-gladiator-captain-america-1602-comic-skins-good/"
    ),
    "2024-11-22_Marvel-Rivals-Gladiator-Captain-America-Should-Inspire-Another-Type-of-Skin.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-game-return-deadpool-why-steam-updates/"
    ),
    "2024-11-22_One-Marvel-Game-Could-Be-Primed-for-a-Huge-Comeback.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-new-map-wakanda-black-panther-domination-explained/"
    ),
    "2024-11-21_Marvel-Rivals-New-Map-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-new-season-14-hero-hazard-phreaks-lore-explained/"
    ),
    "2024-11-20_Overwatch-2s-New-Hero-Hazard-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/black-myth-wukong-goty-nomination-lowest-rating-81-bad-why/"
    ),
    "2024-11-19_Black-Myth-Wukongs-GOTY-Nomination-Sticks-Out-Like-a-Sore-Thumb.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/genshin-impact-version-5-2-chasca-ororon/"
    ),
    "2024-11-16_What-to-Expect-From-Genshin-Impact-Version-5-2.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-1-4-banners-lumi-camellya-explained/"
    ),
    "2024-11-15_Wuthering-Waves-1-4-Banners-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-classic-fortnite-og-permanent-limited-time-mode-why/"
    ),
    "2024-11-14_Why-Overwatch-Classic-Can-t-Follow-in-Fortnite-OG-s-Footsteps.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-1-4-last-huanglong-nation-patch-good-bad-why/"
    ),
    "2024-11-13_Wuthering-Waves-Pros-and-Cons-of-1-4-Being-the-Last-Huanglong-Patch.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-expectations-wait-good-bad-indie-lesson/"
    ),
    "2024-11-12_Hollow-Knight-Silksong-May-Be-a-Wake-Up-Call-for-Better-or-Worse.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-arcane-season-2-jinx-vi-skins-return-good-timing/"
    ),
    "2024-11-12_Fortnite-Needs-To-Take-Advantage-of-One-Obvious-Opportunity.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-banner-reruns-good-bad-pros-cons/"
    ),
    "2024-11-09_The-Case-For-and-Against-Rerun-Banners-in-Wuthering-Waves.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-chapter-6-leaked-game-modes-og-open-world-5v5/"
    ),
    "2024-11-05_Every-New-Leaked-Fortnite-Mode-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-new-horizons-webfishing-similar-indie-game/"
    ),
    "2024-11-03_Why-Animal-Crossing-New-Horizons-Fans-Shouldnt-Sleep-on-Webfishing.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/death-note-killer-within-among-us-gameplay-good-why/"
    ),
    "2024-11-02_Death-Note-Killer-Withins-Among-Us-Like-Gameplay-Could-Be-a-Match-Made-in-Heaven.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-6v6-return-convenient-marvel-rivals-competition/"
    ),
    "2024-10-31_Overwatch-2-Bringing-Back-6v6-Feels-Conveniently-Timed.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-meta-judged-based-on-reinhardt-viability-why/"
    ),
    "2024-10-28_The-State-of-Overwatch-2-Can-Often-Be-Judged-By-Looking-at-One-Hero.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-season-14-hero-tank-phreaks-green-hair-ability-prediction/"
    ),
    "2024-10-23_Predicting-Overwatch-2s-Season-14-Hero-Based-on-In-Game-Teasers.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-characters-roster-deadpool-add-when/"
    ),
    "2024-10-22_Marvel-Rivals-Can-t-Leave-One-Character-Off-of-Its-Roster-for-Very-Long.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-mobile-game-adaptation-rumor-controversy-explained/"
    ),
    "2024-10-18_The-Overwatch-2-Mobile-Game-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/life-is-strange-unwritten-rules-playthrough-order-notebooks-exploration/"
    ),
    "2024-10-16_The-Unwritten-Rules-of-Life-is-Strange-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/arcane-season-2-league-legends-end-story-new-protagonists-s3-good-why/"
    ),
    "2024-10-14_Arcane-Season-2-Will-Be-a-Farewell-But-League-of-Legends-Can-Make-it-Less-Definitive.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-season-12-hero-tier-list-best-worst-juno-zenyatta/"
    ),
    "2024-10-03_Overwatch-2-Season-12-Hero-Tier-List.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-13-banners-phase-characters/"
    ),
    "2024-10-02_Wuthering-Waves-1-3-Banners-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/life-is-strange-double-exposure-safiya-moses-who-new-characters/"
    ),
    "2024-10-02_Life-is-Strange-Double-Exposure-Who-Are-Safiya-and-Moses.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/life-is-strange-double-exposure-hannah-telle-voice-actor-max-return/"
    ),
    "2024-09-30_How-Life-is-Strange-Double-Exposure-s-Max-Dodges-the-Other-Darrin-Treatment.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-next-game-kk-slider-ending-story-bad-why/"
    ),
    "2024-09-24_The-Next-Animal-Crossing-Should-Avoid-Ending-With-a-Whimper-Instead-of-a-Bang-Like-New-Horizons.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/nintendo-switch-2-rumors-leaks-dual-screens-ds-game-boy-gba/"
    ),
    "2024-09-22_Why-the-Nintendo-Switch-2-Could-Be-the-DS-to-the-Switch-s-Game-Boy.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-dva-meta-controversy-tank-hero-good-why/"
    ),
    "2024-09-15_Overwatch-2-s-D-Va-Meta-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/europa-indie-game-journey-studio-ghibli-art-gameplay-similar/"
    ),
    "2024-09-13_Journey-and-Studio-Ghibli-Fans-Should-Keep-an-Eye-on-Europa.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-city-folk-moving-van-villagers-keep-return-good/"
    ),
    "2024-09-10_The-Next-Animal-Crossing-Could-Really-Use-One-City-Folk-Feature.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-shorekeeper-5-star-spectro-support-explained/"
    ),
    "2024-09-06_Wuthering-Waves-Who-is-The-Shorekeeper.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-clash-new-game-mode-balance-controversy-explained/"
    ),
    "2024-08-31_Overwatch-2-s-Clash-Mode-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-pocket-camp-service-end-good/"
    ),
    "2024-08-31_Animal-Crossing-Pocket-Camp-Ending-Service-Could-Give-the-Next-Mainline-Game-the-Lion-s-Share.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-waveworn-phenomenon-explained/"
    ),
    "2024-08-26_Wuthering-Waves-What-is-the-Waveworn-Phenomenon.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-absolute-doom-season-gwenpool-marvel-comics-origins/"
    ),
    "2024-08-24_Fortnite-Who-is-Gwenpool.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/splitgate-2-mechanics-interview/"
    ),
    "2024-08-23_Splitgate-2-Interview-Developer-Details-New-Mechanics-Lore-and-Meta.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-season-12-new-features-additions-explained/"
    ),
    "2024-08-22_Every-New-Feature-and-Addition-For-Overwatch-2-Season-12-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/splitgate-2-foundations-factions-crouch-slide-strategy/"
    ),
    "2024-08-22_Splitgate-2-Details-Distinctive-New-Physics-Based-Features-and-Factions.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-potential-post-match-potg-feature-overwatch-similar/"
    ),
    "2024-08-18_Marvel-Rivals-is-One-Step-Away-From-an-Ideal-Post-Match-Approach.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/solo-leveling-arise-summer-update-explained-swimsuit-costumes/"
    ),
    "2024-08-11_Solo-Leveling-Arise-s-Summer-Update-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-rumored-co-op-feature-changes-seperate-teams/"
    ),
    "2024-08-03_Wuthering-Waves-Rumored-Co-Op-Feature-Changes-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-map-specific-stories-good-future-plot/"
    ),
    "2024-08-03_Marvel-Rivals-Map-Specific-Stories-Are-an-Exciting-Sign-For-The-Future.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/apex-legends-new-map-e-district-cyberpunk/"
    ),
    "2024-08-01_Apex-Legends-New-E-District-Map-Is-A-Cyberpunk-Fan-s-Dream-Come-True.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-adam-warlock-overwatch-mercy-similar-risk-overpowered/"
    ),
    "2024-08-01_Marvel-Rivals-Is-Already-Walking-a-Very-Fine-Line.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-marvel-rivals-tournament-system-competitive-good-why/"
    ),
    "2024-07-28_Overwatch-2-Should-Steal-an-Idea-from-Marvel-Rivals.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-juno-support-healing-damage-kit-mediblaster-good-why/"
    ),
    "2024-07-26_Overwatch-2-s-Juno-Shows-a-Lot-of-Promise-for-Future-Support-Heroes.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-potential-fast-season-12-meta-juno-hyper-ring/"
    ),
    "2024-07-23_Overwatch-2-May-Be-in-for-a-Fast-Paced-Meta-After-Juno-s-Release.html",
  ],
  [
    normalizeArticleUrl("https://gamerant.com/exploding-kittens-interview/"),
    "2024-07-15_Exploding-Kittens-Interview-Tom-Ellis-and-Sasheer-Zamata-Talk-All-Things-Godcat-and-Devilcat.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-addressing-6v6-5v5-debate-biggest-risk-yet/"
    ),
    "2024-07-12_Overwatch-2s-Plan-to-Address-6v6-May-Be-The-Games-Biggest-Risk-Yet.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/nyan-heroes-interview-hero-shooter-lore-development-cats/"
    ),
    "2024-07-10_Nyan-Heroes-Interview-Devs-Discuss-Lore-Game-Mechanics-and-More.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-hanzo-rework-scatter-arrow-sniper-abilities-meta-good-bad/"
    ),
    "2024-07-09_Overwatch-2-Needs-to-Avoid-One-Massive-OW1-Pitfall-with-a-Potential-Hanzo-Rework.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-space-ranger-potential-annoying-new-hero-flight-pharah/"
    ),
    "2024-07-08_Overwatch-2-s-Space-Ranger-Can-t-Add-to-One-Annoying-Hero-Combo.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-reinhardt-mythic-weapon-skin-bad-monetization-prisms/"
    ),
    "2024-06-25_Overwatch-2-s-Mythic-Reinhardt-Weapon-Skin-is-a-Slippery-Slope.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/wuthering-waves-resonators-story-frequencies-forte-types-explained/"
    ),
    "2024-06-23_Wuthering-Waves-Lore-of-the-Resonators-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/strinova-overwatch-2-controversy-marvel-rivals-similar-maps/"
    ),
    "2024-06-16_Strinova-s-Overwatch-2-Controversy-is-Marvel-Rivals-All-Over-Again.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-marvel-rivals-concord-2024-hero-shooter-genre/"
    ),
    "2024-06-16_2024-is-the-Year-of-the-Hero-Shooter.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/multiversus-joker-harley-more-dc-characters-batman-villains/"
    ),
    "2024-06-13_MultiVersus-Joker-and-Harley-Should-Only-Be-The-Beginning-of-a-Long-Journey.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-ban-system-false-issues-chat-good-bad-why/"
    ),
    "2024-06-13_Overwatch-2-s-Ban-System-is-a-Double-Edged-Sword.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/the-finals-june-13-season-3-release-ranked/"
    ),
    "2024-06-09_June-13-is-a-Big-Day-for-The-Finals.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-hornet-strong-starting-tools-upgrades/"
    ),
    "2024-06-08_Why-Hollow-Knight-Silksong-is-Likely-Going-to-Hit-The-Ground-Running.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-launch-problems-clones-marvel-rivals-concord-cause/"
    ),
    "2024-06-06_Overwatch-2-May-Be-the-Reason-for-the-Rise-in-Overwatch-Clones.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-concord-story-lore-drops-cinematic-system-good-bad/"
    ),
    "2024-06-04_Overwatch-2-s-Lore-Could-Learn-From-Concord-s-Cinematic-System.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/disney-dreamlight-valley-animal-crossing-new-horizons-mini-game-problem/"
    ),
    "2024-05-31_Disney-Dreamlight-Valley-Still-Shares-a-Problem-With-Animal-Crossing.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-overwatch-2-heroes-character-parallel-comparisons/"
    ),
    "2024-05-20_Marvel-Rivals-Characters-Have-a-Clear-Parallel-with-Some-Overwatch-2-Heroes.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-pre-alpha-hero-tier-list-good-bad-best-worst/"
    ),
    "2024-05-17_Marvel-Rivals-Pre-Alpha-Hero-Tier-List.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-og-skins-popularity-rarity-dedication-good-why/"
    ),
    "2024-05-12_Why-Fortnite-s-OG-Skins-Are-the-Ultimate-Flex.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-sequel-hornet-playable-kickstarter-good-why/"
    ),
    "2024-05-08_How-Hollow-Knight-Silksong-is-Doubling-Down-on-an-Old-Promise.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-overwatch-2-hanamura-map-design-copy-controversy/"
    ),
    "2024-05-07_Marvel-Rivals-Overwatch-2-s-Map-Design-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-dung-defender-special-treatment-why-good/"
    ),
    "2024-04-28_Why-One-Hollow-Knight-Boss-Got-Its-Special-Treatment.html",
  ],
  [
    normalizeArticleUrl("https://gamerant.com/tell-me-your-story-interview/"),
    "2024-04-22_Tell-Me-Your-Story-Dev-Talks-Inspirations-Future-Plans-and-More.html",
  ],
  [
    normalizeArticleUrl("https://gamerant.com/hollow-knight-boss-tier-list/"),
    "2024-04-21_Hollow-Knight-Boss-Tier-List.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/tell-me-your-story-new-cozy-game-2024/"
    ),
    "2024-04-21_How-Tell-Me-Your-Story-Aims-to-Connect-with-Cozy-Audiences.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-korra-more-skins-good-avatar-outnumbered-sokka-missing/"
    ),
    "2024-04-13_Fortnite-s-Korra-Skin-Now-Sticks-Out-Like-a-Sore-Thumb.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-mercy-season-10-mythic-pve-convenient/"
    ),
    "2024-04-13_Overwatch-2s-Mercy-Mythic-Feels-Conveniently-Timed.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-hornet-antagonist-foil-clash-rival/"
    ),
    "2024-04-05_Hollow-Knight-Silksong-s-Hornet-Deserves-Her-Own-Rival.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-overwatch-6v6-hero-shooter-what-to-expect/"
    ),
    "2024-03-31_Marvel-Rivals-What-to-Expect-from-the-Upcoming-Overwatch-Style-Shooter.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-overwatch-2-pve-mode-story-lore/"
    ),
    "2024-03-31_Overwatch-2-s-Loss-Could-Be-Marvel-Rivals-Gain.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/marvel-rivals-peni-parker-overwatch-dva-similar/"
    ),
    "2024-03-28_Marvel-Rivals-Peni-Parker-Could-Feel-Very-Familiar-to-Overwatch-Fans.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-new-game-rumors-switch-2-2026-explained/"
    ),
    "2024-03-24_The-New-Animal-Crossing-Game-Rumors-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/elgato-4kx-4k-pro-capture-card-review/"
    ),
    "2024-03-23_Why-Elgato-s-4K-X-and-4K-Pro-Are-a-Huge-Upgrade.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-next-map-rework-idea-numbani-change/"
    ),
    "2024-03-19_There-is-an-Obvious-Candidate-for-Overwatch-2-s-Next-Big-Map-Rework.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/sheepy-short-adventure-hollow-knight-silksong-similar/"
    ),
    "2024-03-14_Sheepy-A-Short-Adventure-Is-the-Perfect-Game-for-Those-Waiting-on-Silksong.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-free-dlc-updates-similar-good/"
    ),
    "2024-03-08_Hollow-Knight-Silksong-Should-Copy-One-of-the-Original-s-Best-Tricks.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/helldivers-2-joel-character-game-master-explained/"
    ),
    "2024-03-05_Helldivers-2-Who-is-Joel.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-silence-nintendo-switch-2-release-soon/"
    ),
    "2024-02-23_Hollow-Knight-Silksong-s-Silence-May-Be-Good-News-For-Nintendo-Switch-2.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/minecraft-animal-crossing-new-horizon-scorpion-mob/"
    ),
    "2024-02-19_Animal-Crossing-New-Horizons-Scariest-Bug-Would-Be-Perfect-in-Minecraft.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-save-world-game-mode-what-is-it-changes/"
    ),
    "2024-02-11_Sunsetting-Fortnite-s-Save-the-World-Game-Mode-Might-Be-for-the-Best.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/streamer-awards-2024-controversy-explained-qtcinderella-kyedae-nominees/"
    ),
    "2024-02-03_The-Streamer-Awards-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/palworld-pocketpair-hollow-knight-never-grave-controversy/"
    ),
    "2024-01-27_After-Palworld-Pocketpair-s-Hollow-Knight-Could-Spark-Another-Controversy.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/youtube-channels-content-creators-retirement-good-bad-explained/"
    ),
    "2024-01-17_Why-So-Many-YouTubers-Are-Announcing-Their-Retirement.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-team-cherry-ori-moon-studios-indie-dev/"
    ),
    "2024-01-09_The-Argument-for-Team-Cherry-to-Take-Moon-Studios-Approach-After-Hollow-Knight-Silksong.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/amouranth-ai-influencer-chatbot-explained/"
    ),
    "2024-01-08_Amouranth-s-New-AI-Influencer-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-news-2024-updates-modes-characters/"
    ),
    "2024-01-07_What-to-Expect-From-Overwatch-2-in-2024.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-acquisition-characters-pvp-2024/"
    ),
    "2024-01-01_Why-Overwatch-2-May-Have-a-Better-Year-in-2024-Than-2023.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/lego-fortnite-unwritten-rules-explained/"
    ),
    "2023-12-26_The-Unwritten-Rules-of-LEGO-Fortnite-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/twitchs-topless-meta-artistic-nudity-new-rollback-why-controversy/"
    ),
    "2023-12-16_Twitch-s-Topless-Meta-and-Artistic-Nudity-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-update-december-7-game-awards/"
    ),
    "2023-11-26_Hollow-Knight-Silksong-is-Overdue-an-Update-and-December-7-Could-Be-the-Perfect-Chance.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/suicide-squad-kill-the-justice-league-harley-quinn-batman-motivation/"
    ),
    "2023-11-16_Harley-Quinn-Needs-No-Reason-to-Kill-Batman-in-Suicide-Squad-Kill-the-Justice-League.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-venture-dps-burrow-dig-rek-sai-comparison-similarities-good-why/"
    ),
    "2023-11-12_If-Mauga-is-Overwatch-2-s-Maui-Venture-is-Its-Rek-Sai.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/disney-dreamlight-valley-free-to-play-delayed-indefinitely-why/"
    ),
    "2023-11-11_Why-is-Disney-Dreamlight-Valley-Not-Going-Free-To-Play.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/november-9-japanese-games-like-dragon-gaiden-tales-arise-dlc/"
    ),
    "2023-11-01_November-9-is-a-Big-Day-for-Japanese-Game-Fans.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/minecraft-penguin-armadillo-mob-vote-winner/"
    ),
    "2023-10-30_Why-Minecraft-s-Penguin-Should-Have-Been-the-Mob-Vote-Winner.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/gotham-knights-bat-family-traversal-characters/"
    ),
    "2023-10-27_The-Next-Bat-Family-Game-Needs-to-Rectify-One-Gotham-Knights-Feature.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/subnautica-unwritten-rules-avoid-aurora-world-edge-build-base-storage-space/"
    ),
    "2023-10-22_The-Unwritten-Rules-of-Subnautica-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/youtube-jacksfilms-sssniperwolf-doxxing-accusations-explained/"
    ),
    "2023-10-21_Jacksfilms-And-SSSniperwolf-Doxxing-Accusations-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-new-horizons-post-launch-bugs-fish-critters/"
    ),
    "2023-10-17_Animal-Crossing-New-Horizons-Missed-One-Obvious-Post-Launch-Opportunity.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/titanfall-3-predecessor-mistake-release-window-shooter-competition/"
    ),
    "2023-10-14_Titanfall-3-Cannot-Make-The-Same-Mistake-as-Its-Predecessor.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/october-26-minekos-night-market-dave-the-diver-indie-games/"
    ),
    "2023-10-12_October-26-is-a-Big-Day-for-Indie-Fans.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/twitter-x-elon-musk-livestreaming-plans-explained/"
    ),
    "2023-10-11_Twitters-Live-Streaming-Plans-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/honkai-star-rail-october-sony-ps5-release/"
    ),
    "2023-10-07_October-11-Will-Be-a-Big-Day-for-Honkai-Star-Rail.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-5-crossovers-collaborations-season-7/"
    ),
    "2023-10-07_5-Crossovers-That-Would-Be-Perfect-For-Overwatch-2-After-Season-7.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-season-7-halloween-theme-cosmetics/"
    ),
    "2023-10-06_Overwatch-2-Season-7-is-Fixing-One-Big-Season-1-Mistake.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-new-horizons-5-features-need-return/"
    ),
    "2023-09-30_5-New-Horizons-Features-That-Need-to-Return-in-The-Next-Animal-Crossing.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/xbox-game-pass-minekos-night-market-indie-business-sim-explained/"
    ),
    "2023-09-28_Xbox-Game-Pass-Game-Mineko-s-Night-Market-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/adin-ross-and-kim-jong-un-livestream-explained/"
    ),
    "2023-09-24_Adin-Ross-and-Kim-Jong-Un-Livestream-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-anniversary-shop-good-bad-paid-skins-free/"
    ),
    "2023-09-23_Why-Overwatch-2-s-Anniversary-Shop-is-Actually-a-Double-Edged-Sword.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/stardew-valleys-sandy-calico-desert-oasis-store-name-identity-origins/"
    ),
    "2023-09-20_Stardew-Valley-s-Sandy-Mystery-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-unwritten-rules-exploration-nailmasters-aspids-explained/"
    ),
    "2023-09-19_The-Unwritten-Rules-of-Hollow-Knight-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-roadhog-rework-challenge-identity-hook-ability/"
    ),
    "2023-09-14_Overwatch-2-s-Roadhog-Rework-Has-One-Big-Challenge-to-Overcome.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-new-horizons-surprise-update-theory-when-why/"
    ),
    "2023-09-10_Animal-Crossing-New-Horizons-Surprise-Update-Theory-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-new-game-soon-switch-2-launch-title/"
    ),
    "2023-09-09_Why-a-New-Animal-Crossing-Game-Could-Be-Announced-Soon.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/starfield-dr-disrespect-partnership-denied-reason-controversy-history/"
    ),
    "2023-09-06_Why-Dr-Disrespect-Was-Denied-a-Sponsored-Starfield-Partnership.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/jacksepticeye-mrbeast-twitter-youtube-drama-criticism-explained/"
    ),
    "2023-09-05_Jacksepticeye-and-MrBeast-s-Drama-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/the-unwritten-rules-of-minecraft-explained/"
    ),
    "2023-09-04_The-Unwritten-Rules-of-Minecraft-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-removed-skins-pink-mercy-zarya-alien-brigitte-medic/"
    ),
    "2023-09-04_Every-Overwatch-Skin-That-is-No-Longer-Available.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/nintendo-switch-2-rumors-leaks-explained-features-power-backward-compatibilty/"
    ),
    "2023-09-03_Latest-Switch-2-Rumors-and-Leaks-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/twitch-asmongold-view-botting-discourse/"
    ),
    "2023-08-31_Why-Asmongold-is-Calling-Out-View-Botting-on-Twitch.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-franchise-cursed-villager-designs/"
    ),
    "2023-08-29_The-Most-Cursed-Villager-Designs-in-The-Animal-Crossing-Franchise.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/little-nightmares-3-callisto-protocol-podcast/"
    ),
    "2023-08-26_Little-Nightmares-3-is-Using-One-Trick-From-The-Callisto-Protocols-Playbook.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/twitch-kick-controversial-why-creators-gambling-safety-brand/"
    ),
    "2023-08-24_Why-Twitch-Competitor-Kick-Has-Proven-So-Controversial.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/little-nightmares-3-better-character-customization-co-op-hats/"
    ),
    "2023-08-24_Little-Nightmares-3-Could-Make-One-Feature-from-Its-Predecessor-Even-More-Fun.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/animal-crossing-franchise-villages-best-rare-acnh-explained/"
    ),
    "2023-08-20_The-Rarest-Villagers-in-the-Animal-Crossing-Franchise-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/valorant-film-rumor-riot-games-arcane-agents-first-light-multiverse/"
    ),
    "2023-08-18_What-to-Expect-in-a-Valorant-Film-After-Riot-s-Arcane.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/xqc-fran-adept-breakup-twitch-cheating-rumors-explained/"
    ),
    "2023-08-17_xQc-and-Fran-s-Breakup-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-illari-support-hero-background-sad/"
    ),
    "2023-08-12_Illari-May-Have-the-Most-Tragic-Backstory-in-All-of-Overwatch-2.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/detective-pikachu-returns-release-date-october-2023-games-competition/"
    ),
    "2023-08-11_Detective-Pikachu-Returns-May-Have-Timed-Its-Release-Date-Poorly.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/xqc-reaction-content-controversy-explained/"
    ),
    "2023-08-04_The-Controversy-with-xQc-and-Reaction-Content-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/youtube-viral-skibidi-toilet-event-explained/"
    ),
    "2023-08-01_YouTube-s-Viral-Skibidi-Toilet-Event-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/meta-metaverse-losses-why-audience-reception/"
    ),
    "2023-07-29_Why-the-Metaverse-May-Not-Be-The-Next-Big-Thing.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hello-kitty-island-adventure-preview/"
    ),
    "2023-07-20_Hello-Kitty-Island-Adventure-Preview-The-Perfect-Cozy-Sim-for-Sanrio-Fans.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/xqc-pokimane-kick-twitch-amouranth-valkyrae-controversy/"
    ),
    "2023-07-07_Why-xQc-and-Pokimane-are-Debating-Over-Kick.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/sssniperwolf-jacksfilms-youtube-controversy-explained/"
    ),
    "2023-07-01_The-SSSniperwolf-and-Jacksfilms-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-chapter-4-season-3-heavy-bush-augments-explained/"
    ),
    "2023-06-29_Fortnite-s-New-Augments-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/cyberpunk-edgerunners-how-old-is-david-lucy-rebecca-maine/"
    ),
    "2023-06-21_How-Old-Are-the-Characters-in-Cyberpunk-Edgerunners.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-new-support-hero-melee-counter-pvp/"
    ),
    "2023-06-12_Overwatch-2s-New-Support-Hero-Being-Melee-Focused-Would-Be-a-Double-Edged-Sword.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/call-of-duty-nickmercs-controversy-lgbt-pride-operator-skins-explained/"
    ),
    "2023-06-11_Call-of-Duty-s-NICKMERCS-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/diablo-4-zelda-tears-kingdom-marketing-campaign-release/"
    ),
    "2023-06-04_Diablo-4-Went-the-Opposite-Route-as-Zelda-Tears-of-the-Kingdom-and-It-s-Paying-Off.html",
  ],
  [
    normalizeArticleUrl("https://gamerant.com/free-play-games-pc-june-2023/"),
    "2023-06-02_The-Best-Free-Games-You-Can-Claim-on-PC-June-2023.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/twitch-bans-2023-kai-cenat-pewdiepie-amouranth/"
    ),
    "2023-05-26_The-Biggest-Twitch-Bans-of-2023-So-Far.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/honkai-star-rail-genshin-impact-multiverse-imaginary-tree-explained/"
    ),
    "2023-05-24_How-Honkai-Star-Rail-and-Genshin-Impact-Are-Connected.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-sojourn-animated-short-popularity-increase/"
    ),
    "2023-05-18_Overwatch-2-s-Next-Animated-Short-Can-Change-the-Narrative-Around-Sojourn.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-boycot-explained-pve-talents-hero-mode-canceled/"
    ),
    "2023-05-18_Why-Fans-of-Overwatch-2-Are-Boycotting-the-Game.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-ranked-system-skill-tiers-competitive-explained/"
    ),
    "2023-05-16_Fortnite-s-New-Ranked-System-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-classic-game-mode-6v6-needed-season-2/"
    ),
    "2022-12-08_Overwatch-2-Should-Add-an-Overwatch-Classic-Game-Mode.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-launch-tv-series-opportunity-diablo-netflix/"
    ),
    "2022-10-18_Overwatch-2-s-Launch-Offers-the-Perfect-Opportunity-to-Start-a-TV-Series.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/cyberpunk-2077s-comeback-thanks-to-edgerunners-netflix/"
    ),
    "2022-10-07_Cyberpunk-2077-s-Comeback-Owes-a-Lot-To-Edgerunners.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-biggest-changes-from-ow1-5v5-tank-reworks-new-characters-push-mode/"
    ),
    "2022-10-05_Overwatch-2-The-Biggest-Changes-from-OW1.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/twitch-content-creator-subscriber-troubles-revenue-ninja-streaming-options/"
    ),
    "2022-09-28_What-Ninja-Streaming-on-All-Platforms-Means-for-Twitch-s-Future.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/gundam-evolution-changes-overwatch-2-progression-currency-consoles/"
    ),
    "2022-09-26_What-Gundam-Evolution-Needs-to-Change-to-Compete-with-Overwatch-2.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/twitch-xqc-hasan-drama-adept-breakup-streamer-event-obligations/"
    ),
    "2022-09-24_Twitch-xQc-and-Hasan-Drama-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-gundam-evolution-fan-interest-6v6-gameplay/"
    ),
    "2022-09-21_Why-Overwatch-2-Fans-Are-Flocking-to-Gundam-Evolution.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/twitch-streamers-moving-to-youtube-fuslie-faze-swagg-dr-disrespect/"
    ),
    "2022-09-12_Why-Twitch-Streamers-Are-Moving-to-YouTube.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-controversy-heroes-locked-behind-battle-pass-free-track-balance/"
    ),
    "2022-09-09_Why-Overwatch-2-Locking-Heroes-Behind-the-Battle-Pass-is-So-Controversial.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/genshin-impacts-3-0-update-new-area-indiana-jones-style-adventure/"
    ),
    "2022-09-01_Genshin-Impact-s-3-0-Update-Could-be-Perfect-for-Indiana-Jones-Fans.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/gotham-knights-harley-quinn-boss-fight-dialogue-moves-lacking/"
    ),
    "2022-08-30_Gotham-Knights-Harley-Quinn-is-Missing-Something.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/valve-year-in-review-potential-steam-features-stats/"
    ),
    "2022-08-26_What-We-d-Like-to-See-in-Valve-s-Year-in-Review.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/gotham-knights-gamescom-2022-trailer-all-villains-harley-clayface/"
    ),
    "2022-08-25_Gotham-Knights-Every-Villain-Revealed-in-the-Gamescom-2022-Trailer.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/tower-of-fantasy-genshin-impact-comparisons-differences-stand-out-features/"
    ),
    "2022-08-22_How-Tower-of-Fantasy-Could-Rival-Genshin-Impact.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/gotham-knights-red-hood-nonlethal-approach-character-backstory-guns/"
    ),
    "2022-08-20_Gotham-Knights-Red-Hood-s-Nonlethal-Approach-is-Highly-Confusing.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-best-twitch-streamers-xqc-ml7-harlbeu-emongg-fitzyhere/"
    ),
    "2022-08-13_Best-Overwatch-Twitch-Streamers.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/amouranth-most-viewed-female-twitch-streamer-success-strategies/"
    ),
    "2022-08-09_Why-Amouranth-is-the-Most-Viewed-Female-Twitch-Streamer.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/epic-games-store-pc-platform-free-games-marketing-strategies/"
    ),
    "2022-08-04_The-Epic-Games-Store-is-the-Best-PC-Platform-for-Free-Video-Games.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/twitch-controversies-2022-gambling-amouranth-xqc/"
    ),
    "2022-07-21_Every-Twitch-Controversy-of-2022-So-Far.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/portal-valve-sequel-potential-half-life-alyx-aperture-desk-job/"
    ),
    "2022-07-18_It-s-Time-for-a-New-Portal-Game.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/amazon-prime-gaming-secret-weapon-good-deal-free-games/"
    ),
    "2022-07-17_Amazon-Prime-Gaming-Has-One-Secret-Weapon.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/stray-steam-most-wishlisted-game-the-day-before-controversy/"
    ),
    "2022-07-13_Why-Steam-s-Most-Wishlisted-Game-Has-Changed.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/teabagging-sexual-assault-controversy-explained/"
    ),
    "2022-06-30_The-Teabagging-Sexual-Assault-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/the-day-before-abandoned-similar-game-development-history-setbacks-controversy/"
    ),
    "2022-06-29_The-Day-Before-is-Sounding-Like-Another-Abandoned-Situation.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/valorant-voice-chat-monitoring-controversy-riot-games-safety-feature-good-bad/"
    ),
    "2022-06-29_Riot-Games-Valorant-Voice-Chat-Monitoring-Controversy-Explained.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-fan-theories-lord-of-shades-boss-prequel/"
    ),
    "2022-06-28_Every-Fan-Theory-About-Hollow-Knight-Silksong-So-Far.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/suicide-squad-kill-the-justice-league-king-shark-powers-abilities-origins/"
    ),
    "2022-06-27_How-Suicide-Squad-Kill-The-Justice-League-Can-Embrace-King-Shark-s-Raw-Power.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/celeste-2-extremely-ok-games-potential-unlikely-spiritual-sequel/"
    ),
    "2022-06-26_Why-Celeste-2-is-Unlikely-to-Happen.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-battle-passes-good-potential-halo-infinite-inspiration/"
    ),
    "2022-06-17_Why-Overwatch-2-Adding-Battle-Passes-is-a-Smart-Move.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/overwatch-2-junker-king-new-teaser-trailer-queen-lore/"
    ),
    "2022-06-15_Overwatch-2-Who-is-the-Junker-King.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-xbox-bethesda-showcase-trailer-hornet-new-abilities-gameplay/"
    ),
    "2022-06-14_Every-Hornet-Ability-in-Hollow-Knight-Silksong-s-Xbox-Bethesda-Showcase-Trailer.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/pikmin-4-3-10-years-eventual-release-when/"
    ),
    "2022-06-11_Pikmin-4-Will-Likely-Release-A-Full-Decade-After-Pikmin-3.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/hollow-knight-silksong-appearance-june-2022-summer-game-fest-likelihood/"
    ),
    "2022-06-08_Will-Hollow-Knight-Silksong-Appear-Somewhere-in-June-2022.html",
  ],
  [
    normalizeArticleUrl(
      "https://gamerant.com/fortnite-chapter-3-season-3-reality-tree-seeds-weapon-mechanic-explained/"
    ),
    "2022-06-06_Fortnite-Chapter-3-Season-3-s-Reality-Tree-Explained.html",
  ],
]);

function getArchiveFileName(article) {
  return (
    uploadedArchiveFilesByUrl.get(normalizeArticleUrl(article.url)) ?? null
  );
}

function getArchiveUrl(article) {
  const archiveFileName = getArchiveFileName(article);

  if (!archiveFileName) {
    return null;
  }

  return `${R2_ARCHIVE_BASE_URL}/${encodeURIComponent(archiveFileName)}`;
}

export default function App() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [showPortfolioBuilder, setShowPortfolioBuilder] = useState(false);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...articles]
      .filter((article) => {
        return (
          article.title.toLowerCase().includes(normalizedSearch) ||
          article.url.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((firstArticle, secondArticle) => {
        const firstDate = new Date(firstArticle.publicationDate);
        const secondDate = new Date(secondArticle.publicationDate);

        return sortOrder === "newest"
          ? secondDate - firstDate
          : firstDate - secondDate;
      });
  }, [search, sortOrder]);

  function toggleArticle(articleUrl) {
    setSelectedArticles((currentSelection) => {
      if (currentSelection.includes(articleUrl)) {
        return currentSelection.filter((url) => url !== articleUrl);
      }

      return [...currentSelection, articleUrl];
    });
  }

  function clearSelection() {
    setSelectedArticles([]);
  }

  function formatDate(publicationDate) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(publicationDate));
  }

  async function fetchArchivedArticle(article) {
    const archiveUrl = getArchiveUrl(article);

    if (!archiveUrl) {
      throw new Error("This archived article has not been connected yet.");
    }

    const response = await fetch(archiveUrl);

    if (!response.ok) {
      throw new Error(`Archive request failed (${response.status}).`);
    }

    return response;
  }

  async function downloadArchivedHtml(article) {
    try {
      const response = await fetchArchivedArticle(article);
      const htmlText = await response.text();
      const htmlBlob = new Blob([htmlText], {
        type: "text/html;charset=utf-8",
      });
      const temporaryUrl = URL.createObjectURL(htmlBlob);
      const downloadLink = document.createElement("a");

      downloadLink.href = temporaryUrl;
      downloadLink.download = getArchiveFileName(article);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      window.setTimeout(() => URL.revokeObjectURL(temporaryUrl), 30000);
    } catch (error) {
      console.error(error);
      window.alert(
        "I couldn't download this archived article. Check the Cloudflare R2 CORS setting, then try again."
      );
    }
  }

  async function printArchivedArticle(article) {
    /*
     * Open the empty tab immediately while this click is still considered a
     * user action. That keeps Chrome from treating it as an unwanted pop-up.
     */
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      window.alert(
        "Chrome blocked the print window. Please allow pop-ups for this site and try again."
      );
      return;
    }

    printWindow.document.write(
      "<!doctype html><title>Preparing article…</title><p>Preparing your article for printing…</p>"
    );

    try {
      const response = await fetchArchivedArticle(article);
      const htmlText = await response.text();

      /*
       * Keep the print tab on the app's origin and write the preserved page
       * into it directly. Navigating the tab to a temporary blob URL can
       * detach the load callback before Chrome gets a chance to print.
       */
      printWindow.document.open();
      printWindow.document.write(htmlText);
      printWindow.document.close();

      const waitStartedAt = Date.now();

      function openPrintDialogWhenReady() {
        if (printWindow.closed) {
          return;
        }

        const pageFinishedLoading =
          printWindow.document.readyState === "complete";
        const maximumWaitReached = Date.now() - waitStartedAt >= 10000;

        if (pageFinishedLoading || maximumWaitReached) {
          window.setTimeout(() => {
            if (!printWindow.closed) {
              printWindow.focus();
              printWindow.print();
            }
          }, 1000);
          return;
        }

        window.setTimeout(openPrintDialogWhenReady, 250);
      }

      openPrintDialogWhenReady();
    } catch (error) {
      console.error(error);
      printWindow.close();
      window.alert(
        "I couldn't prepare this article for printing. Check the Cloudflare R2 CORS setting, then try again."
      );
    }
  }

  return (
    <div className="archive">
      <header className="archive-header">
        <div className="plant-decoration plant-left" aria-hidden="true">
          <span>❧</span>
          <span>❧</span>
          <span>❧</span>
        </div>

        <div className="header-content">
          <div className="header-copy">
            <p className="eyebrow">GameRant Article Archive</p>

            <h1>Bubby’s Wayback Machine</h1>

            <p className="introduction">
              Inspired by the Internet Archive’s Wayback Machine, which has
              preserved pieces of the web since 1996.
            </p>

            <p className="introduction">
              Every world you explored, character you loved, and story you
              shared. Gathered into your cozy internet corner ♡.
            </p>

            <div className="archive-stats">
              <div>
                <strong>{articles.length}</strong>
                <span>Stories saved</span>
              </div>

              <div>
                <strong>{filteredArticles.length}</strong>
                <span>Showing</span>
              </div>

              <div>
                <strong>{selectedArticles.length}</strong>
                <span>Picked for sharing</span>
              </div>
            </div>
          </div>

          <div className="puppy-artwork">
            <div className="puppy-glow" aria-hidden="true" />

            <img
              src="/bubblePuppies.png"
              alt="Two pastel Maltese puppy characters made by Big Bubby"
            />

            <p>little bubby + big Bubby ♡</p>
          </div>
        </div>
      </header>

      <main className="archive-main">
        <section className="bubby-note">
          <img
            className="note-puppies"
            src="/heartPuppies.png"
            alt="Big Bubby and little bubby sharing hearts"
          />
          <div className="note-leaves" aria-hidden="true">
            <span>⌇</span>
            <span>⌇</span>
            <span>⌇</span>
          </div>

          <div className="bubby-note-decoration" aria-hidden="true">
            <span>♡</span>
            <span>✿</span>
            <span>☆</span>
          </div>

          <p className="eyebrow">From big Bubby</p>

          <h2>For my little bubby</h2>

          <p>
            I am so proud of you and everything you have created. You put so
            much of your imagination, heart, and personality into your writing,
            and every one of these stories deserves a safe home where they will
            not disappear.
          </p>

          <p>
            You are my sister and my best friend. I am so excited to see
            everything you create next, all the worlds you explore, and every
            place your writing takes you. I made this so you can always look
            back and see how much you have already accomplished. 
            </p>

            <p>
            "Further Up & Further In!" - <i> The Last Battle </i>
           </p>

          <p className="bubby-signature">
            I buh boo,
            <strong>big Bubby ♡</strong>
          </p>
        </section>

        <section className="controls" aria-label="Story search and filters">
          <label className="search-field">
            <span>Search your stories</span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, game, topic, or URL..."
            />
          </label>

          <label className="sort-field">
            <span>Sort by date</span>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </section>

        {selectedArticles.length > 0 && (
          <section className="selection-bar">
            <div>
              <strong>
                {selectedArticles.length}{" "}
                {selectedArticles.length === 1 ? "story" : "stories"} selected
              </strong>

              <span>
                Your selected stories can become a custom portfolio or PDF
                packet.
              </span>
            </div>

            <div className="selection-actions">
              <button
                className="portfolio-button"
                type="button"
                onClick={() => setShowPortfolioBuilder(true)}
              >
                Build sharing packet
              </button>

              <button
                className="clear-button"
                type="button"
                onClick={clearSelection}
              >
                Clear selection
              </button>
            </div>
          </section>
        )}

        <section className="results-heading">
          <div>
            <p className="eyebrow">Your story collection</p>

            <h2>
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "story" : "stories"}
            </h2>
          </div>

          <div className="results-leaf" aria-hidden="true">
            ❧
          </div>
        </section>

        {filteredArticles.length > 0 ? (
          <section className="article-grid">
            {filteredArticles.map((article, index) => {
              const isSelected = selectedArticles.includes(article.url);
              const archiveFileName = getArchiveFileName(article);
              const archiveUrl = getArchiveUrl(article);
              const archiveIsUploaded = Boolean(archiveFileName && archiveUrl);

              return (
                <article
                  className={`article-card ${
                    isSelected ? "article-card-selected" : ""
                  }`}
                  key={article.url}
                >
                  <div className={`article-cover cover-${index % 4}`}>
                    <div className="cover-decoration" aria-hidden="true">
                      <span>✿</span>
                      <span>☆</span>
                      <span>♡</span>
                    </div>

                    <span className="gr-mark">GR</span>

                    <label className="selection-control">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleArticle(article.url)}
                      />

                      <span>Select</span>
                    </label>
                  </div>

                  <div className="article-content">
                    <time dateTime={article.publicationDate}>
                      {formatDate(article.publicationDate)}
                    </time>

                    <h3>{article.title}</h3>

                    <p className="verification-status">
                      Saved safely in your collection
                    </p>

                    <div className="article-actions">
                      <a href={article.url} target="_blank" rel="noreferrer">
                        View original
                      </a>

                      {archiveIsUploaded ? (
                        <>
                          <a href={archiveUrl} target="_blank" rel="noreferrer">
                            Archived copy
                          </a>

                          <button
                            type="button"
                            onClick={() => downloadArchivedHtml(article)}
                            title="Download the preserved SingleFile HTML copy"
                          >
                            Download HTML
                          </button>

                          <button
                            type="button"
                            onClick={() => printArchivedArticle(article)}
                            title="Open Chrome's print window and choose Save as PDF"
                          >
                            Print / Save PDF
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled
                            title="This archived HTML file has not been uploaded yet"
                          >
                            Archived copy
                          </button>

                          <button
                            type="button"
                            disabled
                            title="This archived HTML file has not been uploaded yet"
                          >
                            Download HTML
                          </button>

                          <button
                            type="button"
                            disabled
                            title="This archived HTML file has not been uploaded yet"
                          >
                            Print / Save PDF
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="empty-state">
            <div className="empty-decoration" aria-hidden="true">
              ERROR 404
            </div>

            <img
              className="empty-puppies"
              src="/parkviewPuppies.png"
              alt="little bubby and Big Bubby sitting together in the park"
            />

            <h2>No stories found</h2>

            <p>
              Nothing found here except little bubby and big Bubby exploring in
              the park.
            </p>

            <button type="button" onClick={() => setSearch("")}>
              back up ←
            </button>
          </section>
        )}
      </main>

      <footer className="archive-footer">
        <img
          className="footer-puppies"
          src="/handPuppies.png"
          alt="little bubby and big Bubby holding hands"
        />

        <div className="footer-content">
          <div className="footer-symbols" aria-hidden="true">
            ♡ &nbsp; ✿ &nbsp; ♡
          </div>

          <p className="footer-heading">
            🐻🚀 ⋆｡°✩ I’m an astronaut, you’re the Moon ✩°｡⋆🐭🌙
          </p>

          <p className="footer-message">
            ✿ We didn’t just get to be sisters. We got to be sisters together. ✿
          </p>
          <p
  style={{
    margin: "48px auto 16px",
    maxWidth: "850px",
    padding: "0 24px",
    textAlign: "center",
    fontSize: "11px",
    lineHeight: "1.6",
    opacity: 0.45,
  }}
>
  Built as a React application in CodeSandbox and deployed as a static site
  through GitHub Pages. Original GameRant article URLs are normalized and
  mapped to preserved HTML snapshots stored in a Cloudflare R2 object-storage
  archive, allowing the React frontend to resolve legacy article references to
  independently hosted archival copies. Source and deployment are maintained
  through GitHub.
</p>
        </div>
      </footer>
    </div>
  );
}
