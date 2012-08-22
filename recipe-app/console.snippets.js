recipeApp.models.recipeList.add({
	id: 8675309,
	title: "Burke Holland's Epic Potato Salad",
	description: "So Epic, if we told you, we'd have to kill you",
	items: [ "$$", "Burke's Phone Number" ],
	steps: [ "Call Burke", "Set up a secret meet", "Pay serious $$", "Consume Epic Potato-Salad-y-goodness" ]
});


recipeApp.models.recipeList.get(8675309);

recipeApp.router.navigate("recipe/8675309", { trigger: true });

recipeApp.router.navigate("recipe/8675309/edit", { trigger: true });

recipeApp.models.recipeList.remove(8675309);