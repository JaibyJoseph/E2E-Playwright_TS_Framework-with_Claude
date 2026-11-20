import { expect, test } from '@test/unit/support/unit.fixture';

const LIST_HTML = `
  <li class="item">  Apple </li><li class="item">Banana split</li><li class="item">Cherry</li>
  <p id="picked"></p>
  <script>
    document.querySelectorAll('.item').forEach((item) => {
      item.onclick = () => (picked.textContent = item.textContent.trim());
    });
  </script>`;

const SEARCH_HTML = `
  <form onsubmit="event.preventDefault(); result.textContent = 'Enter: ' + q.value">
    <input id="q" />
  </form>
  <button id="go" onclick="result.textContent = 'Button: ' + q.value">Search</button>
  <p id="result"></p>`;

const DROPDOWN_HTML = `
  <select id="country">
    <option value="">Choose</option><option value="in">India</option>
    <option value="gb">United Kingdom</option>
  </select>
  <button id="fruit" onclick="fruits.hidden = false">Pick fruit</button>
  <ul id="fruits" role="listbox" hidden><li role="option">Apple</li><li role="option">Banana</li></ul>
  <div id="colour" onclick="colours.hidden = false">Pick colour</div>
  <div id="colours" hidden><div class="colour">Red</div><div class="colour">Green</div></div>
  <p id="chosen"></p>
  <script>
    document.querySelectorAll('[role=option], .colour').forEach((item) => {
      item.onclick = () => {
        chosen.textContent = item.textContent;
        item.parentElement.hidden = true;
      };
    });
  </script>`;

const AUTOCOMPLETE_HTML = `
  <input id="city" />
  <ul id="suggestions"></ul>
  <script>
    city.oninput = () => {
      suggestions.innerHTML = '';
      ['Bangalore', 'Bangkok', 'Berlin']
        .filter((name) => name.toLowerCase().startsWith(city.value.toLowerCase()))
        .forEach((name) => {
          const option = document.createElement('li');
          option.setAttribute('role', 'option');
          option.textContent = name;
          option.onclick = () => ((city.value = name), (suggestions.innerHTML = ''));
          suggestions.append(option);
        });
    };
  </script>`;

const TABLE_HTML = `
  <table id="users">
    <thead><tr><th>Name</th><th>Email</th><th>Action</th></tr></thead>
    <tbody>
      <tr><td>Asha</td><td>asha@example.com</td><td><button>Edit</button></td></tr>
      <tr><td>Ravi</td><td>ravi@example.com</td><td><button>Edit</button></td></tr>
    </tbody>
  </table>
  <p id="edited"></p>
  <script>
    document.querySelectorAll('#users button').forEach((button) => {
      button.onclick = () => (edited.textContent = button.closest('tr').cells[0].textContent);
    });
  </script>`;

test.describe('BasePage lists', () => {
  test.beforeEach(async ({ openHtml }) => openHtml(LIST_HTML));

  test('findItemByText matches whole text ignoring case and spaces', async ({ ui }) => {
    await expect(await ui.findItemByText('.item', 'apple')).toHaveText('Apple');
  });

  test('findItemByText matches part of the text when exact is false', async ({ ui }) => {
    await expect(await ui.findItemByText('.item', 'split', false)).toHaveText('Banana split');
  });

  test('findItemByText fails listing the available items', async ({ ui }) => {
    await expect(ui.findItemByText('.item', 'Banana')).rejects.toThrow(
      'No item matching "Banana". Available: Apple | Banana split | Cherry',
    );
  });

  test('clickItemByText clicks the matching item', async ({ ui, page }) => {
    await ui.clickItemByText('.item', 'Cherry');
    await expect(page.locator('#picked')).toHaveText('Cherry');
  });
});

test.describe('BasePage search', () => {
  test.beforeEach(async ({ openHtml }) => openHtml(SEARCH_HTML));

  test('submits with Enter when no button is given', async ({ ui, page }) => {
    await ui.search('#q', 'shoes');
    await expect(page.locator('#result')).toHaveText('Enter: shoes');
  });

  test('submits with the given button', async ({ ui, page }) => {
    await ui.search('#q', 'bags', '#go');
    await expect(page.locator('#result')).toHaveText('Button: bags');
  });
});

test.describe('BasePage dropdowns', () => {
  test.beforeEach(async ({ openHtml }) => openHtml(DROPDOWN_HTML));

  test('selects a native option by its label', async ({ ui, page }) => {
    await ui.selectFromDropdown('#country', 'india');
    await expect(page.locator('#country')).toHaveValue('in');
  });

  test('selects a native option by part of its label', async ({ ui, page }) => {
    await ui.selectFromDropdown('#country', 'Kingdom', { exact: false });
    await expect(page.locator('#country')).toHaveValue('gb');
  });

  test('fails on a missing native option, listing the options', async ({ ui }) => {
    await expect(ui.selectFromDropdown('#country', 'France')).rejects.toThrow(
      'No item matching "France". Available: Choose | India | United Kingdom',
    );
  });

  test('opens a custom dropdown and picks a role=option item', async ({ ui, page }) => {
    await ui.selectFromDropdown('#fruit', 'Banana');
    await expect(page.locator('#chosen')).toHaveText('Banana');
    await expect(page.locator('#fruits')).toBeHidden();
  });

  test('uses the given items for a custom dropdown without roles', async ({ ui, page }) => {
    await ui.selectFromDropdown('#colour', 'Green', { items: '.colour' });
    await expect(page.locator('#chosen')).toHaveText('Green');
  });

  test('fails on a missing custom option, listing the options', async ({ ui }) => {
    await expect(ui.selectFromDropdown('#fruit', 'Mango')).rejects.toThrow(
      'No item matching "Mango". Available: Apple | Banana',
    );
  });

  test('getDropdownOptions reads native and custom options', async ({ ui }) => {
    expect(await ui.getDropdownOptions('#country')).toEqual(['Choose', 'India', 'United Kingdom']);
    expect(await ui.getDropdownOptions('#fruit')).toEqual(['Apple', 'Banana']);
    expect(await ui.getDropdownOptions('#colour', '.colour')).toEqual(['Red', 'Green']);
  });
});

test.describe('BasePage autocomplete', () => {
  test.beforeEach(async ({ openHtml }) => openHtml(AUTOCOMPLETE_HTML));

  test('picks the suggestion that matches the typed text', async ({ ui, page }) => {
    await ui.typeAndSelect('#city', 'Bangalore');
    await expect(page.locator('#city')).toHaveValue('Bangalore');
  });

  test('picks a different suggestion than the typed text', async ({ ui, page }) => {
    await ui.typeAndSelect('#city', 'Ban', 'Bangkok');
    await expect(page.locator('#city')).toHaveValue('Bangkok');
  });
});

test.describe('BasePage tables', () => {
  test.beforeEach(async ({ openHtml }) => openHtml(TABLE_HTML));

  test('getTableRow finds the row so an action inside it can be used', async ({ ui, page }) => {
    await ui
      .getTableRow('#users', 'ravi@example.com')
      .getByRole('button', { name: 'Edit' })
      .click();
    await expect(page.locator('#edited')).toHaveText('Ravi');
  });

  test('getColumnValues reads a column by header, ignoring case', async ({ ui }) => {
    expect(await ui.getColumnValues('#users', 'email')).toEqual([
      'asha@example.com',
      'ravi@example.com',
    ]);
  });

  test('getColumnValues fails on an unknown header, listing the headers', async ({ ui }) => {
    await expect(ui.getColumnValues('#users', 'Phone')).rejects.toThrow(
      'No item matching "Phone". Available: Name | Email | Action',
    );
  });
});
