# vue-searchbox

>

`Vue SearchBox` offers a lightweight (~22KB: Minified + Gzipped) and performance focused searchbox UI component to query and display results from your ElasticSearch app (aka index) using declarative props. It is an alternative to using the [DataSearch component](https://docs.appbase.io/docs/reactivesearch/vue/search/DataSearch/) from Vue ReactiveSearch.

---

[![NPM](https://img.shields.io/npm/v/vue-searchbox.svg)](https://www.npmjs.com/package/vue-searchbox) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install vue-searchbox
# or
yarn add vue-searchbox
```

## Usage

### Basic Usage

```html
<vue-searchBox
  app="good-books-ds"
  credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
  :dataField="['original_title', 'original_title.search']"
/>
```

### Usage With All Props

```html
<vue-searchBox
  app="good-books-ds"
  credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
  :dataField="[
		{ field: 'original_title', weight: 1 },
		{ field: 'original_title.search', weight: 3 },
	]"
  title="Search"
  defaultValue="Songwriting"
  placeholder="Search for books"
  :autosuggest="true"
  :defaultSuggestions="[
		{ label: 'Songwriting', value: 'Songwriting' },
		{ label: 'Musicians', value: 'Musicians' },
	]"
  :highlight="true"
  highlightField="group_city"
  queryFormat="or"
  fuzziness="AUTO"
  :showClear="true"
  :showVoiceSearch="true"
/>
```
