<template>
  <section>
    <div @click="focusInput(), (selected = null)">
      <o-tabs v-model="activeTab" expanded>
        <o-tab-item :value="0" label="users_7k"></o-tab-item>
        <o-tab-item :value="1" label="world_cities_140k"></o-tab-item>
        <o-tab-item :value="2" label="github_11k"></o-tab-item>
        <o-tab-item :value="3" label="businesses_11k"></o-tab-item>
      </o-tabs>
    </div>
    <section>
      <o-autocomplete
        v-model="query"
        ref="input"
        open-on-focus
        clearOnSelect
        placeholder="Search..."
        :data="fuzzySearch.result.slice(0, 50)"
        :field="fuzzySearch.key"
        @select="(option) => (selected = option)"
      />
      <div class="stats-bottom-left">
        <span>
          {{ fuzzySearch.result.length }} results in {{ fuzzySearch.elapsed }}ms
        </span>
      </div>
      <div class="stats-bottom-right">
        <span> {{ fuzzySearch.length }} objects </span>
      </div>
    </section>
    <pre>{{ selected ? JSON.stringify(selected, null, 4) : "" }}</pre>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import usersData from "../../data/users_7k.json";
import citiesData from "../../data/world_cities_140k.json";
import githubData from "../../data/github_11k.json";
import businessesData from '../../data/businesses_11k.json'
import FuzzySearch from '../../fuse-basic.js';

export default {
  mounted() {
    this.$refs.input.focus();
  },
  methods: {
    focusInput() {
      this.$refs.input.focus();
    },
  },
  setup() {
    const activeTab = ref(0);
    const query = ref("");
    const city = ref("");
    const selected = ref(null);
    const options = {
      threshold: 0.2,
      distance: 100,
      keys: ["name"],
    };

    const fuzzySearchUsers = new FuzzySearch(usersData, options);
    const fuzzySearchCities = new FuzzySearch(citiesData, options);
    const fuzzySearchGithub = new FuzzySearch(githubData, {
      ...options,
      keys: ["repo.name"],
    });
    const fuzzySearchBusinesses = new FuzzySearch(businessesData, {
      ...options,
      keys: ["properties.CompanyName"],
    });
    
    const fuzzySearch = computed(() => {
      let fuzzy = null;
      let length = 0;
      let key = "";

      switch (activeTab.value) {
        case 0:
          fuzzy = fuzzySearchUsers;
          length = usersData.length;
          key = fuzzySearchUsers.options.keys[0];
          break;
        case 1:
          fuzzy = fuzzySearchCities;
          length = citiesData.length;
          key = fuzzySearchCities.options.keys[0];
          break;
        case 2:
          fuzzy = fuzzySearchGithub;
          length = githubData.length;
          key = fuzzySearchGithub.options.keys[0];
          break;
        case 3:
          fuzzy = fuzzySearchBusinesses;
          length = businessesData.length;
          key = fuzzySearchBusinesses.options.keys[0];
          break;
      }

      const start = Date.now();
      const result = fuzzy.search(query.value).map((option) => option.item);
      const end = Date.now();

      const elapsed = end - start;
      
      return { result, elapsed, length, key };
    });

    return {
      activeTab,
      query,
      city,
      selected,
      fuzzySearch,
    };
  },
};
</script>

<style>
  @import './style.css';
</style>
