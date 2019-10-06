<h1 align="center"><strong>Project Tools</strong></h1>

[![Build Status](https://travis-ci.org/Hooked74/project-tools.svg?branch=master)](https://travis-ci.org/Hooked74/project-tools)
[![npm](https://img.shields.io/npm/v/@hooked74/project-tools)](https://www.npmjs.com/package/@hooked74/project-tools)
[![License](https://img.shields.io/npm/l/@hooked74/project-tools)](https://github.com/Hooked74/project-tools/blob/master/LICENSE)

## Table of contents

<!--ts-->
   * [Install](#install)
   * [Usage](#usage)
   * [Available Commands](#available-commands)
<!--te-->

## Install

```
npm install @hooked74/project-tools
```

## Usage

```
project-tools <command>
```

## Available Commands

### **size**

Add the size of the minified gzip module to the **.size-snapshot.json** file. Converts size from bytes, leading it to optimal.

### **types**

Format types in a compiled project and add common types from **src/react-app-env.d.ts** to the **dist/common.d.ts**. Also add a reference to the **common.d.ts** file in **index.d.ts**.

### **storybook**

Start the storybook process and while it's running it execute the npm process. Need to pass npm command. Usage:

```
project-tools storybook [options] <npm command>
```

Has the following options:

- **-p, -port** storybook port
- **-t, -timeout** storybook process timeout

