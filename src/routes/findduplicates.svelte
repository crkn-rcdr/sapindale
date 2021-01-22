<script>
  let choice = "showDuplicates";
  let count = 0;
  let outputText = "";
  let inputText = "";
  let underscoresToHiphens = false;

  function update() {
    console.log("inputText", inputText);
    var rawOutput = convertBasedOnSelection();
    count = rawOutput.length;
    outputText = format(rawOutput);
  }

  function convertBasedOnSelection() {
    var words = inputText.split(/[\s,]/);
    console.log("after splitting", words);
    switch (choice) {
      case "showDuplicates":
        return convertToShowDuplicates(words);
      case "showSingles":
        return convertToShowSingles(words);
      case "removeDuplicates":
        return convertToRemoveDuplicates(words);
    }
  }

  function convertToShowDuplicates(words = []) {
    var outputWords = new Array();
    for (var wordIndex in words) {
      var word = words[wordIndex];
      delete words[wordIndex];
      //if a second copy of this word can be found in the inputs
      if (words.includes(word)) {
        //if this word cannot be found in the output
        if (!outputWords.includes(word) && word.match(/[0-9a-zA-Z]/)) {
          outputWords.push(word);
        }
      }
      words[wordIndex] = word;
    }
    return outputWords;
  }

  function convertToShowSingles(words = []) {
    var outputWords = new Array();

    for (var wordIndex in words) {
      var word = words[wordIndex];
      delete words[wordIndex];
      if (!words.includes(word) && word.match(/[0-9a-zA-Z]/))
        outputWords.push(word);
      words[wordIndex] = word;
    }
    return outputWords;
  }

  function convertToRemoveDuplicates(words = []) {
    var outputWords = new Array();

    for (var wordIndex in words) {
      var word = words[wordIndex];
      //if this word cannot be found in the output
      if (!outputWords.includes(word) && word.match(/[0-9a-zA-Z]/)) {
        outputWords.push(word);
      }
    }
    return outputWords;
  }

  function format(rawOutput = []) {
    var input = laterelize(rawOutput);
    console.log("input", input);
    if (underscoresToHiphens) {
      return input.replace(/_/g, "-");
    } else {
      return input;
    }
  }

  function laterelize(words = []) {
    var output = "";
    for (var word in words) output += words[word] + "\n";
    return output;
  }
</script>

<svelte:head>
  <title>Sapindale — Find Duplicates</title>
</svelte:head>

<h1>Find duplicates tool</h1>

<fieldset>
  <legend>Paste text here</legend>
  <textarea id="inputText" bind:value={inputText} />
</fieldset>
<fieldset>
  <legend>Decide what operation to do:</legend>
  <label for="showDuplicates">
    <input
      type="radio"
      id="showDuplicates"
      bind:group={choice}
      value="showDuplicates" />
    items that occur more than once (duplicates)
  </label>
  <label for="showSingles">
    <input
      type="radio"
      bind:group={choice}
      id="showSingles"
      value="showSingles" />
    items that occur once (singular items)
  </label>
  <label for="removeDuplicates">
    <input
      type="radio"
      bind:group={choice}
      id="removeDuplicates"
      value="removeDuplicates" />
    unique items (remove duplicates)
  </label>
  <label for="underscoresToHiphens">
    <input
      type="checkbox"
      id="underscoresToHiphens"
      bind:checked={underscoresToHiphens} />
    Change all "_" into "-"
  </label>
  <button on:click={update}>Update output</button>
</fieldset>

<fieldset>
  <legend>Output will be displayed here</legend>
  Tip: You can select all by clicking in the box and pressing Ctrl + A on your
  keyboard
  <br />
  <textarea id="output" disabled="true" bind:value={outputText} />
  {#if count > 0}
    <i id="count" class="danger">Count : {count}</i>
  {/if}
  <br />
</fieldset>
