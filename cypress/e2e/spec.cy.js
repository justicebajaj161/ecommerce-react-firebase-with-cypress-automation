const url=`http://localhost:3000`



describe('Routers with assigned endpoints should be reached correctly ', () => {
 it('/login route render correctly ',()=>{
    cy.visit(`${url}/login`);
    cy.url().should('eq', 'http://localhost:3000/login');
  })
  it('/signup route render correctly ',()=>{
    cy.visit(`${url}/signup`);
    cy.url().should('eq', 'http://localhost:3000/signup');
  })
  it('/cartproducts route render correctly ',()=>{
    cy.visit(`${url}/cartproducts`);
    cy.url().should('eq', 'http://localhost:3000/cartproducts');
  })
  it('/addproducts route render correctly ',()=>{
    cy.visit(`${url}/addproducts`);
    cy.url().should('eq', 'http://localhost:3000/addproducts');
  })
  it('/cashout route render correctly ',()=>{
    cy.visit(`${url}/cashout`);
    cy.url().should('eq', 'http://localhost:3000/cashout');
  })
  it('* route render correctly ',()=>{
    cy.visit(`${url}/*`);
    cy.url().should('eq', 'http://localhost:3000/*');
  })
})

describe('Sign Up Flow', () => {
 
 it('should visit the signup page', () => {
    cy.visit(`${url}/signup`);
    cy.wait(5000);
    cy.url().should('eq', 'http://localhost:3000/signup');
  });
 
  it('should have name input', () => {
    cy.visit(`${url}/signup`);
    cy.get('form').should('be.visible');  // Wait for form
    cy.log('Checking label for name');
    cy.get('label').contains(/name/i).should('be.visible');
    cy.log('Checking input for name');
    cy.get('input[type="text"]').should('be.visible');
});
  it('should email input', () => {
    cy.visit(`${url}/signup`);
    cy.get('form').should('be.visible');  // Wait for form
    cy.log('Checking label for email');
    cy.get('label').contains(/email/i).should('be.visible');
    cy.log('Checking input for email');
   
    cy.get('input[type="email"]').should('be.visible');
  });

it('should password input', () => {
    cy.visit(`${url}/signup`);
    cy.get('form').should('be.visible');  // Wait for form
    cy.log('Checking label for password');
    cy.get('label').contains(/password/i).should('be.visible');
    cy.log('Checking input for password');
    cy.get('input[type="password"]').should('be.visible');
  });
  it('should submit button', () => {
    cy.visit(`${url}/signup`);
    cy.wait(5000);

    cy.get('button').contains(/submit/i).click();
  });
// // Invalid Signup Attempt
it('should not proceed and show toast error if all fields are not entered', () => {
    cy.visit(`${url}/signup`);
    cy.wait(5000);
    
    // Filling in the form
    cy.get('input[type="text"]').type('John');
    cy.get('input[type="email"]').type('john.doe@example'); 
    // cy.get('input[type="password"]').type('123'); // Password less than 6 characters
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    
    cy.wait(5000);
    
    cy.url().should('eq', `${url}/signup`);
  });

  it('should not proceed and show "Password should be at least 6 characters" in toast if password is less than 6', () => {
    cy.visit(`${url}/signup`);
    cy.wait(5000);
    
    // Filling in the form
    cy.get('input[type="text"]').type('John');
    cy.get('input[type="email"]').type('john.doe@example'); 
    cy.get('input[type="password"]').type('123'); // Password less than 6 characters
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Check for toast error message
    cy.contains(/Password should be at least 6 characters/i).should('be.visible'); // Assuming the toast error is for not completing all fields
    cy.wait(5000);
    
    // Ensure we're still on the signup page after a failed submission
    cy.url().should('eq', `${url}/signup`);
  });
it('should sign up with valid data and automatically after signedup should be navigated to login page', () => {
    cy.visit(`${url}/signup`);
    cy.wait(5000);
    // Using a unique email to ensure uniqueness during testing.
    const uniqueEmail = `test${Date.now()}@example.com`;

    cy.get('input[type="text"]').type('John');
  
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="password"]').type('password123');
    cy.get('button').contains(/Submit/i).click();
    cy.wait(8000);
    cy.url().should('eq', 'http://localhost:3000/login');
  });
});
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit(`${url}/login`);
    cy.wait(5000);
  });

  it('should visit the login page', () => {
    cy.url().should('eq', 'http://localhost:3000/login');
  });

  it('should have email input', () => {
    cy.get('input[type="email"]').should('be.visible');
  });

  it('should have password input', () => {
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should have a login button', () => {
    cy.get('button').contains(/LOGIN/).should('be.visible');
  });

  it('should not proceed and show toast error if Password less than 6 characters', () => {
    cy.get('input[type="email"]').type('john.doe@example.com'); 
    cy.get('input[type="password"]').type('123');
    cy.get('button').contains(/LOGIN/).click();
    cy.contains(/Password should be at least 6 characters/i).should('be.visible'); 
    cy.url().should('eq', `${url}/login`);
  });

  it('should display error when invalid data is provided which havent signed up', () => {
    cy.get('input[type="email"]').type('invalid@codingninjas.com');
    cy.get('input[type="password"]').type('12345678');
    cy.get('button').contains(/LOGIN/).click();
    cy.contains(/Incorrect email or password./i).should('be.visible');
  });

  it('should login with valid data', () => {
    cy.get('input[type="email"]').type('codingninjas@codingninjas.com'); // Assuming this user is already registered
    cy.get('input[type="password"]').type('codingninjas');
    cy.get('button').contains(/LOGIN/).click();
    cy.wait(5000); // Wait for possible redirects or actions after login
    cy.url().should('eq', 'http://localhost:3000/');
  });
})


describe('Protected Routes', () => {

  beforeEach(() => {
      // Visit login and perform a login
      cy.visit('http://localhost:3000/login');
      cy.get('input[type="email"]').type('codingninjas@codingninjas.com'); // Assuming this user is already registered
      cy.get('input[type="password"]').type('codingninjas');
      cy.get('button').contains(/LOGIN/).click();
      cy.wait(5000); // Wait for possible redirects or actions after login
  });

  it('should access the home page after login', () => {
      cy.url().should('eq', 'http://localhost:3000/');
  });

  it('should access the cart products page after login', () => {
      cy.visit('http://localhost:3000/cartproducts');
      cy.url().should('eq', 'http://localhost:3000/cartproducts');
  });

  it('should access the add products page after login', () => {
      cy.visit('http://localhost:3000/addproducts');
      cy.url().should('eq', 'http://localhost:3000/addproducts');
  });

  it('should access the cashout page after login', () => {
      cy.visit('http://localhost:3000/cashout');
      cy.url().should('eq', 'http://localhost:3000/cashout');
  });

  describe('Without login', () => {

      beforeEach(() => {
          // Clearing the user session to simulate a non-logged-in state
          cy.visit('http://localhost:3000/login');
          cy.get('input[type="email"]').type('codingninjas@codingninjas.com'); // Assuming this user is already registered
          cy.get('input[type="password"]').type('codingninjas');
          cy.get('button').contains(/LOGIN/).click();
          cy.wait(5000); // Wait for possible redirects or actions after login
          cy.visit('http://localhost:3000');
          cy.contains(/logout/i).click()
          
      });

      it('should not access cart products page without login', () => {
          cy.visit('http://localhost:3000/cartproducts');
          cy.url().should('eq', 'http://localhost:3000/login'); // Redirects to login
      });

     

      it('should not access the cashout page without login', () => {
          cy.visit('http://localhost:3000/cashout');
          cy.url().should('eq', 'http://localhost:3000/login'); // Redirects to login
      });
  });
});
describe('Logout button', () => {

  beforeEach(() => {
    // Visit login and perform a login
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type('codingninjas@codingninjas.com'); // Assuming this user is already registered
    cy.get('input[type="password"]').type('codingninjas');
    cy.get('button').contains(/LOGIN/).click();
    cy.wait(5000); // Wait for possible redirects or actions after login
});

  it('The logout should navigate back to login page , clearing the localstorage', () => {
    cy.visit('http://localhost:3000')
    cy.contains(/logout/i).click()
    cy.visit('http://localhost:3000/login');
  });


});



describe('addproducts', () => {

  const url = 'http://localhost:3000'; // define the base URL for reusability
  const testProductName = "Test Product";
  const testProductPrice = "123"; // Use a string representation since we're typing into an input field
  const filePath = '1038746.png'; 

  beforeEach(() => {
      // Visit login and perform a login
      cy.visit(`${url}/login`);
      cy.get('input[type="email"]').type('codingninjas@codingninjas.com');
      cy.get('input[type="password"]').type('codingninjas');
      cy.get('button').contains(/LOGIN/).click();
      cy.wait(5000);
      cy.visit(`${url}/addproducts`);
  });

  it('should display input for product name with label of "Product Name" ', () => {
    // Verify Product Name input
    
    cy.get('label').contains(/Product Name/i).should('be.visible');
      cy.get('input[type="text"]').should('be.visible');
      
    
    });
    
    
    it('should display input for product price with label of "Product Price"', () => {
    
      cy.get('label').contains(/Product Price/i).should('be.visible');
      cy.get('input[type="number"]').should('be.visible');
      
    
    });
    
    it('should display a input field for file for uploading photo for the product and have id named file', () => {
    
      // Verify Product Image file input
      cy.get('input[type="file"]').should('have.id', 'file');
      
    
    });
    
    it('should display "ADD" button', () => {
    
      // Verify Add button
      cy.get('button').contains(/ADD/i).should('be.visible');
    });

  it('should add product and verify index page that the products displaying , the products component should be render in index or home page', () => {
      // Fill in product details
      cy.get('input[type="text"]').type(testProductName);
      cy.get('input[type="number"]').type(testProductPrice);
      cy.get('input[type="file"]').attachFile(filePath);
      cy.get('button').contains(/ADD/i).click();
       cy.wait(8000)
      // Navigate to the products page
      cy.visit(`${url}/`);
      cy.wait(5000)
      // Check if product is added correctly
      cy.contains(testProductName).should('be.visible');
      cy.contains(`Rs ${testProductPrice}.00`).should('be.visible');
      cy.get('img').should('have.attr', 'src') // You'll need to adjust this based on how your images are named or stored in Firebase
  });

});


describe('Products Page Functionality', () => {
    
  const url = 'http://localhost:3000';
  const testProductName = "Test Product";
  const testProductPrice = "123"; // Use a string representation since we're typing into an input field
  const filePath = '1038746.png'; // Test image in your Cypress fixtures directory
  
  beforeEach(() => {
     
      cy.visit(`${url}/login`);
      cy.get('input[type="email"]').type('codingninjas@codingninjas.com');
      cy.get('input[type="password"]').type('codingninjas');
      cy.get('button').contains(/LOGIN/).click();
      cy.wait(5000);
  });

  it('should have an "Add to Cart" button for products', () => {
    cy.contains(/ADD TO CART/i).should('be.visible')
  });

  it('should increase the item count in the cart icon after product is added', () => {
    // Get the initial cart count
    cy.get('.no-of-products').invoke('text').then((initialCount) => {
        const initialItemCount = parseInt(initialCount, 10);

        // Add a product to the cart
        cy.get('.product-card').first().within(() => {
            cy.contains(/add to cart/i).click();
        });

        // Check if the cart count increased by 1
        cy.get('.no-of-products').should('contain', initialItemCount + 1);
    });
});


  it('should display a toast "added to cart!" when a product is added but if the product already is added it should show "this product is already in your cart"', () => {
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
  });

  // Try to find either of the toasts
  cy.get('body').then($body => {
      if ($body.text().includes('added to cart!')) {
          cy.contains(/added to cart!/i).should('be.visible');
      } else if ($body.text().includes('this product is already in your cart')) {
          cy.contains(/this product is already in your car/i).should('be.visible');
      } else {
          assert.fail('Neither toast messages were found!');
      }
  });
            
  });


  it('should display be visible in cart page after adding the product "', () => {
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
      cy.wait(8000)
       });
  cy.get('.cart-icon').click()
  cy.wait(8000)
  cy.get('.cart-card').should('have.length.at.least', 1); // Ensure there's at least one product in the cart

  cy.get('.cart-card').within(() => {
      cy.get('.cart-img img').should('have.attr', 'src') 
      cy.get('.cart-name').should('contain.text', testProductName);
      cy.get('.cart-price-orignal').should('contain.text', testProductPrice);
  });
    
  });


});
describe('Cart page ', () => {

  beforeEach(() => {
    cy.visit(`${url}/login`);
    cy.get('input[type="email"]').type('codingninjas@codingninjas.com');
    cy.get('input[type="password"]').type('codingninjas');
    cy.get('button').contains(/LOGIN/).click();
 
  });

  it('in cart the increase (+) with className .inc button should increase the item in cart',()=>{
    cy.wait(5000);
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
      cy.wait(8000);
    });
    cy.get('.cart-icon').click();
    cy.wait(8000);
    cy.get('.quantity').invoke('text').then((text1) => {
      const initialQty = parseInt(text1);
      cy.get('.inc').click();
      cy.get('.quantity').invoke('text').then((text2) => {
        const newQty = parseInt(text2);
        expect(newQty).to.equal(initialQty + 1);
      });
    });
  });
  
  it('in cart the decrease (-) with className .dec button should decrease the item in cart',()=>{
    cy.wait(5000);
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
      cy.wait(4000);
    });
    cy.get('.cart-icon').click();
    cy.wait(4000);
    cy.get('.quantity').invoke('text').then((text1) => {
      const initialQty = parseInt(text1);
      cy.get('.inc').click();
      cy.get('.quantity').invoke('text').then((text2) => {
        const newQty = parseInt(text2);
        expect(newQty).to.equal(initialQty + 1);
      });
    });
    cy.get('.quantity').invoke('text').then((text1) => {
      const initialQty = parseInt(text1);
      cy.get('.dec').click();
      cy.get('.quantity').invoke('text').then((text2) => {
        const newQty = parseInt(text2);
        expect(newQty).to.equal(initialQty - 1);
      });
    });
  });
  
  it('the delete button (dustbin icon with className delete-btn) should delete from cart',()=>{
    cy.wait(2000);
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
      cy.wait(4000);
    });
    cy.get('.cart-icon').click();
    cy.wait(4000);
  
    cy.get('.cart-card').each(($el, index, $list) => {
      const key = $el.attr('key');
      cy.get('.delete-btn').eq(index).click();
      cy.wait(2000); // Adding a wait to ensure the deletion is completed
      cy.get(`.cart-card[key="${key}"]`).should('not.exist');
    });
  });
  
  it('in cart in the cart summary for the checkout, the summary price should have a class of .cart-summary-price and should show the final cart price',()=>{
    cy.wait(5000);
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
      cy.wait(4000);
    });
    cy.get('.cart-icon').click();
    cy.wait(4000);
    cy.get('.cart-summary-price').should('be.visible');
  });

  it('in cart in the cart summary for the checkout, the summary quantity of items should have a class of .cart-summary-quantity and should show the final cart quantity',()=>{
    // Adding a class name to your quantity div to target it here
    cy.wait(5000);
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
      cy.wait(4000);
    });
    cy.get('.cart-icon').click();
    cy.wait(4000);
    cy.get('.cart-summary-quantity').should('be.visible');
  });

  it('should be a button in the summary of cash on delivery',()=>{
    cy.wait(5000);
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
      cy.wait(4000);
    });
    cy.get('.cart-icon').click();
    cy.wait(4000);
    cy.contains(/cash on delivery/i).should('be.visible');
  });

  it('the cash on delivery button should lead the the /cashout page ',()=>{
    cy.wait(5000);
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
      cy.wait(4000);
    });
    cy.get('.cart-icon').click();
    cy.wait(4000);
    cy.contains(/cash on delivery/i).should('be.visible').click();
    cy.wait(5000)
    cy.url().should('eq', 'http://localhost:3000/cashout');
  });
});


describe('Cashout page', () => {
 

  beforeEach(() => {
    cy.visit(`${url}/login`);
    cy.get('input[type="email"]').type('codingninjas@codingninjas.com');
    cy.get('input[type="password"]').type('codingninjas');
    cy.get('button').contains(/LOGIN/).click();
    cy.wait(5000);
    cy.get('.product-card').first().within(() => {
      cy.contains(/add to cart/i).click();
      cy.wait(4000);
    });
    cy.get('.cart-icon').click();
    cy.wait(4000);
    cy.contains(/cash on delivery/i).should('be.visible').click();
    cy.wait(5000);
  });

  it('should have a name input field with respective label', () => {

    cy.get('label').contains(/name/i).should('be.visible');
    cy.get('input[type="text"][value]').should('be.visible');
    
  });

 

  it('should have a Cell No input field with respective label', () => {
    cy.get('label').contains(/cell no/i).should('be.visible');
    cy.get('input[type="number"]').should('be.visible').should('have.attr', 'placeholder', 'eg 03123456789');
  });

  it('should have a Delivery Address input field with respective label', () => {
    cy.get('label').contains(/delivery address/i).should('be.visible');
    cy.get('input[type="text"]').should('be.visible');
  });

  it('should have a Price To Pay input field with respective label', () => {
    cy.get('label').contains(/price to pay/i).should('be.visible');
    cy.get('input[type="number"][value]').should('be.visible');
  });

  it('should have a Total No of Products input field with respective label', () => {
    cy.get('label').contains(/total no of products/i).should('be.visible');
    cy.get('input[type="number"][value]').should('be.visible');
  });

  it('should have a SUBMIT button', () => {
    cy.get('button').contains(/submit/i).should('be.visible');
  });


  it('should fill the form, submit it, and redirect to home page , make sure the name , email , price to pay , and total no of products render automatically . The user should only address and cell no. ', () => {
    // Fill in the Cell No field
    cy.get('label').contains(/cell no/i).next('input').type('03123456789');
    
    // Fill in the Delivery Address field
    cy.get('label').contains(/delivery address/i).next('input').type('123 Street, Example City2277747474744 , mayfield garden , secor 5667 , usa , india , china ');
    
    // Click the submit button
    cy.get('button').contains(/submit/i).click();
    
    // Check for the success message
    cy.contains(/Your order has been placed successfully. Thanks for visiting us. You will be redirected to home page after 5 seconds/i).should('be.visible');
    
    // Wait for the redirection to happen (5 seconds + a little buffer)
    cy.wait(8000);
    
    // Check that we have been redirected to the home page
    cy.url().should('eq', `${url}/`); // replace `${url}/` with your actual home page URL
  });
  
});










