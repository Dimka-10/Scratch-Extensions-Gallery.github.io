// Name: AniList API
// ID: anilistAPI
// Description: Interact with AniList GraphQL API to search and get information about anime, manga, characters, and users.
// By: Assistant
// License: MIT

(function (Scratch) {
  "use strict";
  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("This extension must run in unsandboxed mode");
  }

  class AniListAPI {
    constructor() {
      this.apiUrl = "https://graphql.anilist.co";
      this.lastResponse = null;
      this.lastError = null;
      this.currentPage = 1;
      this.perPage = 10;
      this.searchQuery = "";
      this.searchType = "ANIME";
      this.lastSearchResults = [];
      this.selectedMedia = null;
      this.selectedCharacter = null;
      this.selectedUser = null;
    }

    getInfo() {
      return {
        id: "anilistAPI",
        name: "AniList API",
        color1: "#02a9ff",
        color2: "#0288d1",
        blocks: [
          {
            opcode: "searchAnimeManga",
            blockType: Scratch.BlockType.COMMAND,
            text: "search [TYPE] for [QUERY]",
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "mediaType",
                defaultValue: "ANIME"
              },
              QUERY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Attack on Titan"
              }
            }
          },
          {
            opcode: "setResultsPerPage",
            blockType: Scratch.BlockType.COMMAND,
            text: "set results per page to [COUNT]",
            arguments: {
              COUNT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: "getResultTitle",
            blockType: Scratch.BlockType.REPORTER,
            text: "result [INDEX] title",
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: "getResultId",
            blockType: Scratch.BlockType.REPORTER,
            text: "result [INDEX] ID",
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: "selectResult",
            blockType: Scratch.BlockType.COMMAND,
            text: "select result [INDEX]",
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: "getSelectedTitle",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected title"
          },
          {
            opcode: "getSelectedEnglishTitle",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected English title"
          },
          {
            opcode: "getSelectedDescription",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected description"
          },
          {
            opcode: "getSelectedEpisodes",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected episodes"
          },
          {
            opcode: "getSelectedChapters",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected chapters"
          },
          {
            opcode: "getSelectedVolumes",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected volumes"
          },
          {
            opcode: "getSelectedStatus",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected status"
          },
          {
            opcode: "getSelectedScore",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected average score"
          },
          {
            opcode: "getSelectedPopularity",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected popularity"
          },
          {
            opcode: "getSelectedGenres",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected genres"
          },
          {
            opcode: "getSelectedCoverImage",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected cover image URL"
          },
          {
            opcode: "getSelectedBannerImage",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected banner image URL"
          },
          {
            opcode: "getSelectedStartDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected start date"
          },
          {
            opcode: "getSelectedEndDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected end date"
          },
          {
            opcode: "getSelectedSeason",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected season"
          },
          "---",
          {
            opcode: "searchCharacter",
            blockType: Scratch.BlockType.COMMAND,
            text: "search character [QUERY]",
            arguments: {
              QUERY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Levi"
              }
            }
          },
          {
            opcode: "getCharacterResultName",
            blockType: Scratch.BlockType.REPORTER,
            text: "character result [INDEX] name",
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: "selectCharacterResult",
            blockType: Scratch.BlockType.COMMAND,
            text: "select character result [INDEX]",
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: "getSelectedCharacterName",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected character name"
          },
          {
            opcode: "getSelectedCharacterDescription",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected character description"
          },
          {
            opcode: "getSelectedCharacterImage",
            blockType: Scratch.BlockType.REPORTER,
            text: "selected character image URL"
          },
          "---",
          {
            opcode: "getUser",
            blockType: Scratch.BlockType.COMMAND,
            text: "get user [USERNAME]",
            arguments: {
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "AniList"
              }
            }
          },
          {
            opcode: "getUserName",
            blockType: Scratch.BlockType.REPORTER,
            text: "user name"
          },
          {
            opcode: "getUserAvatar",
            blockType: Scratch.BlockType.REPORTER,
            text: "user avatar URL"
          },
          {
            opcode: "getUserAbout",
            blockType: Scratch.BlockType.REPORTER,
            text: "user about"
          },
          {
            opcode: "getUserStats",
            blockType: Scratch.BlockType.REPORTER,
            text: "user stats"
          },
          "---",
          {
            opcode: "getCurrentSeason",
            blockType: Scratch.BlockType.REPORTER,
            text: "current season anime"
          },
          {
            opcode: "getTrendingAnime",
            blockType: Scratch.BlockType.REPORTER,
            text: "trending anime"
          },
          {
            opcode: "getPopularAnime",
            blockType: Scratch.BlockType.REPORTER,
            text: "popular anime"
          },
          {
            opcode: "clearCache",
            blockType: Scratch.BlockType.COMMAND,
            text: "clear cache"
          },
          {
            opcode: "getLastError",
            blockType: Scratch.BlockType.REPORTER,
            text: "last error"
          }
        ],
        menus: {
          mediaType: {
            items: ["ANIME", "MANGA"]
          }
        }
      };
    }

    async makeGraphQLRequest(query, variables) {
      try {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            query: query,
            variables: variables
          })
        });

        const data = await response.json();
        
        if (data.errors) {
          this.lastError = data.errors[0].message;
          return null;
        }
        
        this.lastError = null;
        return data.data;
      } catch (error) {
        this.lastError = error.message;
        return null;
      }
    }

    async searchAnimeManga(args) {
      const type = args.TYPE;
      const query = args.QUERY;
      
      this.searchType = type;
      this.searchQuery = query;
      this.currentPage = 1;
      
      const searchQuery = `
        query ($search: String, $type: MediaType, $page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(search: $search, type: $type) {
              id
              title {
                romaji
                english
                native
                userPreferred
              }
              description
              episodes
              chapters
              volumes
              status
              averageScore
              popularity
              genres
              coverImage {
                large
                extraLarge
                color
              }
              bannerImage
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              season
              seasonYear
            }
          }
        }
      `;
      
      const variables = {
        search: query,
        type: type,
        page: this.currentPage,
        perPage: this.perPage
      };
      
      const data = await this.makeGraphQLRequest(searchQuery, variables);
      
      if (data && data.Page && data.Page.media) {
        this.lastSearchResults = data.Page.media;
        this.selectedMedia = null;
        this.selectedCharacter = null;
        this.selectedUser = null;
      } else {
        this.lastSearchResults = [];
      }
    }

    setResultsPerPage(args) {
      const count = Math.max(1, Math.min(50, Math.floor(Scratch.Cast.toNumber(args.COUNT))));
      this.perPage = count;
    }

    getResultTitle(args) {
      const index = Math.max(1, Math.min(this.lastSearchResults.length, Math.floor(Scratch.Cast.toNumber(args.INDEX)))) - 1;
      
      if (this.lastSearchResults.length === 0 || index < 0 || index >= this.lastSearchResults.length) {
        return "No results";
      }
      
      const media = this.lastSearchResults[index];
      return media.title.userPreferred || media.title.romaji || media.title.english || "Unknown Title";
    }

    getResultId(args) {
      const index = Math.max(1, Math.min(this.lastSearchResults.length, Math.floor(Scratch.Cast.toNumber(args.INDEX)))) - 1;
      
      if (this.lastSearchResults.length === 0 || index < 0 || index >= this.lastSearchResults.length) {
        return "0";
      }
      
      return this.lastSearchResults[index].id.toString();
    }

    selectResult(args) {
      const index = Math.max(1, Math.min(this.lastSearchResults.length, Math.floor(Scratch.Cast.toNumber(args.INDEX)))) - 1;
      
      if (this.lastSearchResults.length === 0 || index < 0 || index >= this.lastSearchResults.length) {
        this.selectedMedia = null;
        return;
      }
      
      this.selectedMedia = this.lastSearchResults[index];
      this.selectedCharacter = null;
      this.selectedUser = null;
    }

    getSelectedTitle() {
      if (!this.selectedMedia) return "No media selected";
      return this.selectedMedia.title.userPreferred || this.selectedMedia.title.romaji || this.selectedMedia.title.english || "Unknown Title";
    }

    getSelectedEnglishTitle() {
      if (!this.selectedMedia) return "No media selected";
      return this.selectedMedia.title.english || this.selectedMedia.title.romaji || this.selectedMedia.title.userPreferred || "Unknown Title";
    }

    getSelectedDescription() {
      if (!this.selectedMedia) return "No media selected";
      // Remove HTML tags from description
      const description = this.selectedMedia.description || "No description";
      return description.replace(/<[^>]*>/g, "").substring(0, 500);
    }

    getSelectedEpisodes() {
      if (!this.selectedMedia) return "0";
      return (this.selectedMedia.episodes || 0).toString();
    }

    getSelectedChapters() {
      if (!this.selectedMedia) return "0";
      return (this.selectedMedia.chapters || 0).toString();
    }

    getSelectedVolumes() {
      if (!this.selectedMedia) return "0";
      return (this.selectedMedia.volumes || 0).toString();
    }

    getSelectedStatus() {
      if (!this.selectedMedia) return "Unknown";
      return this.selectedMedia.status || "Unknown";
    }

    getSelectedScore() {
      if (!this.selectedMedia) return "0";
      return (this.selectedMedia.averageScore || 0).toString();
    }

    getSelectedPopularity() {
      if (!this.selectedMedia) return "0";
      return (this.selectedMedia.popularity || 0).toString();
    }

    getSelectedGenres() {
      if (!this.selectedMedia) return "No genres";
      return (this.selectedMedia.genres || []).join(", ");
    }

    getSelectedCoverImage() {
      if (!this.selectedMedia) return "";
      return this.selectedMedia.coverImage?.large || this.selectedMedia.coverImage?.extraLarge || "";
    }

    getSelectedBannerImage() {
      if (!this.selectedMedia) return "";
      return this.selectedMedia.bannerImage || "";
    }

    getSelectedStartDate() {
      if (!this.selectedMedia || !this.selectedMedia.startDate) return "Unknown";
      const date = this.selectedMedia.startDate;
      return `${date.year || "?"}-${date.month?.toString().padStart(2, '0') || "?"}-${date.day?.toString().padStart(2, '0') || "?"}`;
    }

    getSelectedEndDate() {
      if (!this.selectedMedia || !this.selectedMedia.endDate) return "Unknown";
      const date = this.selectedMedia.endDate;
      return `${date.year || "?"}-${date.month?.toString().padStart(2, '0') || "?"}-${date.day?.toString().padStart(2, '0') || "?"}`;
    }

    getSelectedSeason() {
      if (!this.selectedMedia) return "Unknown";
      const season = this.selectedMedia.season || "";
      const year = this.selectedMedia.seasonYear || "";
      return season && year ? `${season} ${year}` : "Unknown";
    }

    async searchCharacter(args) {
      const query = args.QUERY;
      
      const searchQuery = `
        query ($search: String, $page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            characters(search: $search) {
              id
              name {
                first
                last
                full
                native
              }
              description
              image {
                large
                medium
              }
              media {
                nodes {
                  title {
                    userPreferred
                  }
                }
              }
            }
          }
        }
      `;
      
      const variables = {
        search: query,
        page: 1,
        perPage: this.perPage
      };
      
      const data = await this.makeGraphQLRequest(searchQuery, variables);
      
      if (data && data.Page && data.Page.characters) {
        this.lastSearchResults = data.Page.characters;
        this.selectedMedia = null;
        this.selectedCharacter = null;
        this.selectedUser = null;
      } else {
        this.lastSearchResults = [];
      }
    }

    getCharacterResultName(args) {
      const index = Math.max(1, Math.min(this.lastSearchResults.length, Math.floor(Scratch.Cast.toNumber(args.INDEX)))) - 1;
      
      if (this.lastSearchResults.length === 0 || index < 0 || index >= this.lastSearchResults.length) {
        return "No results";
      }
      
      const character = this.lastSearchResults[index];
      return character.name.full || character.name.first || "Unknown Character";
    }

    selectCharacterResult(args) {
      const index = Math.max(1, Math.min(this.lastSearchResults.length, Math.floor(Scratch.Cast.toNumber(args.INDEX)))) - 1;
      
      if (this.lastSearchResults.length === 0 || index < 0 || index >= this.lastSearchResults.length) {
        this.selectedCharacter = null;
        return;
      }
      
      this.selectedCharacter = this.lastSearchResults[index];
      this.selectedMedia = null;
      this.selectedUser = null;
    }

    getSelectedCharacterName() {
      if (!this.selectedCharacter) return "No character selected";
      return this.selectedCharacter.name.full || this.selectedCharacter.name.first || "Unknown";
    }

    getSelectedCharacterDescription() {
      if (!this.selectedCharacter) return "No character selected";
      // Remove HTML tags from description
      const description = this.selectedCharacter.description || "No description";
      return description.replace(/<[^>]*>/g, "").substring(0, 500);
    }

    getSelectedCharacterImage() {
      if (!this.selectedCharacter) return "";
      return this.selectedCharacter.image?.large || this.selectedCharacter.image?.medium || "";
    }

    async getUser(args) {
      const username = args.USERNAME;
      
      const userQuery = `
        query ($name: String) {
          User(name: $name) {
            id
            name
            avatar {
              large
              medium
            }
            about
            statistics {
              anime {
                count
                meanScore
                minutesWatched
              }
              manga {
                count
                meanScore
                chaptersRead
              }
            }
          }
        }
      `;
      
      const variables = {
        name: username
      };
      
      const data = await this.makeGraphQLRequest(userQuery, variables);
      
      if (data && data.User) {
        this.selectedUser = data.User;
        this.selectedMedia = null;
        this.selectedCharacter = null;
      } else {
        this.selectedUser = null;
      }
    }

    getUserName() {
      if (!this.selectedUser) return "No user selected";
      return this.selectedUser.name || "Unknown";
    }

    getUserAvatar() {
      if (!this.selectedUser) return "";
      return this.selectedUser.avatar?.large || this.selectedUser.avatar?.medium || "";
    }

    getUserAbout() {
      if (!this.selectedUser) return "No user selected";
      // Remove HTML tags from about
      const about = this.selectedUser.about || "No about information";
      return about.replace(/<[^>]*>/g, "").substring(0, 500);
    }

    getUserStats() {
      if (!this.selectedUser || !this.selectedUser.statistics) return "No stats";
      
      const stats = this.selectedUser.statistics;
      const animeStats = stats.anime || {};
      const mangaStats = stats.manga || {};
      
      const animeInfo = animeStats.count ? `Anime: ${animeStats.count} titles, Score: ${animeStats.meanScore || 0}/10` : "";
      const mangaInfo = mangaStats.count ? `Manga: ${mangaStats.count} titles, Score: ${mangaStats.meanScore || 0}/10` : "";
      
      return [animeInfo, mangaInfo].filter(Boolean).join(" | ");
    }

    async getCurrentSeason() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      let season = "WINTER";
      if (month >= 4 && month <= 6) season = "SPRING";
      else if (month >= 7 && month <= 9) season = "SUMMER";
      else if (month >= 10 && month <= 12) season = "FALL";
      
      const query = `
        query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY_DESC) {
              title {
                userPreferred
              }
            }
          }
        }
      `;
      
      const variables = {
        season: season,
        seasonYear: year,
        page: 1,
        perPage: 10
      };
      
      const data = await this.makeGraphQLRequest(query, variables);
      
      if (data && data.Page && data.Page.media) {
        const titles = data.Page.media.map(m => m.title.userPreferred).filter(Boolean);
        return titles.join(", ");
      }
      
      return "Failed to fetch current season";
    }

    async getTrendingAnime() {
      const query = `
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: TRENDING_DESC) {
              title {
                userPreferred
              }
            }
          }
        }
      `;
      
      const variables = {
        page: 1,
        perPage: 10
      };
      
      const data = await this.makeGraphQLRequest(query, variables);
      
      if (data && data.Page && data.Page.media) {
        const titles = data.Page.media.map(m => m.title.userPreferred).filter(Boolean);
        return titles.join(", ");
      }
      
      return "Failed to fetch trending anime";
    }

    async getPopularAnime() {
      const query = `
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: POPULARITY_DESC) {
              title {
                userPreferred
              }
            }
          }
        }
      `;
      
      const variables = {
        page: 1,
        perPage: 10
      };
      
      const data = await this.makeGraphQLRequest(query, variables);
      
      if (data && data.Page && data.Page.media) {
        const titles = data.Page.media.map(m => m.title.userPreferred).filter(Boolean);
        return titles.join(", ");
      }
      
      return "Failed to fetch popular anime";
    }

    clearCache() {
      this.lastSearchResults = [];
      this.selectedMedia = null;
      this.selectedCharacter = null;
      this.selectedUser = null;
      this.lastError = null;
    }

    getLastError() {
      return this.lastError || "No error";
    }
  }

  Scratch.extensions.register(new AniListAPI());
})(Scratch);