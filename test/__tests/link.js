module( 'Links' );

test( 'Keypaths can be linked', t => {
	let ractive = new Ractive({
		el: fixture,
		template: '{{ foo }} {{ bar.baz.bat }}',
		data: { bar: { baz: { bat: 'linked' } } }
	});

	t.htmlEqual( fixture.innerHTML, ' linked' );
	ractive.link( 'bar.baz.bat', 'foo' );
	t.htmlEqual( fixture.innerHTML, 'linked linked' );
	ractive.set( 'foo', 'bop' );
	t.htmlEqual( fixture.innerHTML, 'bop bop' );
	ractive.set( 'bar.baz.bat', 'bip' );
	t.htmlEqual( fixture.innerHTML, 'bip bip' );
});

/* only for mapped links
test( 'Only top-level keypaths may be linked.', t => {
	let ractive = new Ractive({
		el: fixture,
		template: '{{ foo.bar }}',
		data: { baz: { bat: { bar: 21 } } }
	});
	t.throws( () => {
		ractive.link( 'baz.bat.bar', 'foo.bar' );
	}, /non-root/ );
});

test( 'Links should not be able to hose up component mappings', t => {
	let ractive = new Ractive({
		el: fixture,
		template: '<foo bar="{{baz}}" />',
		data: { baz: 'yep' },
		components: { foo: Ractive.extend({ template: '{{bar}}', data: { bippy: 'nope' } } ) }
	});

	t.htmlEqual( fixture.innerHTML, 'yep' );
	t.throws( () => {
		ractive.findComponent( 'foo' ).link( 'bippy', 'bar' );
	}, /exists for/ );
	t.htmlEqual( fixture.innerHTML, 'yep' );
});

test( 'Linking temporarily overrides exising data', t => {
	let ractive = new Ractive({
		el: fixture,
		template: '{{ foo }}',
		data: { foo: 'tmp', bar: 'Argyll Arms' }
	});

	t.htmlEqual( fixture.innerHTML, 'tmp' );
	ractive.link( 'bar', 'foo' );
	t.htmlEqual( fixture.innerHTML, 'Argyll Arms' );
	ractive.set( 'bar', 'Dog & Duck' );
	t.htmlEqual( fixture.innerHTML, 'Dog & Duck' );
	ractive.unlink( 'foo' );
	t.htmlEqual( fixture.innerHTML, 'tmp' );
});
*/

test( 'Deep references on links should work as expected', t => {
	let ractive = new Ractive({
		el: fixture,
		template: '{{ person.name }} is {{ person.status }}',
		data: {
			people: [
				{ name: 'Rich', status: 'The Man' },
				{ name: 'Marty', status: 'Awesome&tm;' }
			]
		}
	});

	t.equal( fixture.innerHTML, ' is ' );
	ractive.link( 'people.0', 'person' );
	t.htmlEqual( fixture.innerHTML, 'Rich is The Man' );
	ractive.unlink( 'person' );
	t.equal( fixture.innerHTML, ' is ' );
	ractive.link( 'people.1', 'person' );
	t.htmlEqual( fixture.innerHTML, 'Marty is Awesome&tm;' );
});

test( 'Re-linking overwrites the existing link', t => {
	let ractive = new Ractive({
		el: fixture,
		template: '{{ dog.name }}',
		data: { dogs: [ { name: 'Abel' }, { name: 'John' } ] }
	});

	t.equal( fixture.innerHTML, '' );
	ractive.link( 'dogs.0', 'dog' );
	t.equal( fixture.innerHTML, 'Abel' );
	ractive.link( 'dogs.1', 'dog' );
	t.equal( fixture.innerHTML, 'John' );
});

// only for non-mapped links
test( 'Links can be set to nested paths', t => {
	let ractive = new Ractive({
		el: fixture,
		template: '{{ foo.baz.bar }}',
		data: { bippy: { boppy: { bar: 1 } } }
	});

	t.htmlEqual( fixture.innerHTML, '' );
	ractive.link( 'bippy.boppy', 'foo.baz' );
	t.htmlEqual( fixture.innerHTML, '1' );
});

test( 'Links cannot have overlapping paths', t => {
	let ractive = new Ractive({
		el: fixture,
		template: '',
	});

	t.throws( () => {
		ractive.link( 'foo.bar.baz', 'foo' );
	}, /to itself/ );

	t.throws( () => {
		ractive.link( 'foo', 'foo.bar.baz' );
	}, /to itself/ );
});
