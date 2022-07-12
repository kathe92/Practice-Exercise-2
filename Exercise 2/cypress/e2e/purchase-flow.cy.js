require('cypress-xpath');
require('cypress-plugin-tab')

describe('Purchase flow in http://opencart.abstracta.us/', () => {

  beforeEach('Visit the page', () => {
    //Page Access
    cy.visit('http://opencart.abstracta.us/')
    cy.title().should('eq', 'Your Store');
    Cypress.Cookies.preserveOnce('session_id', 'remember_token')
  })
  it('Validate that the purchase of the products added to the cart is completed.', () => {
    //Add the first item - Cellphone
    cy.xpath("//a[contains(.,'iPhone')]").should('be.visible').click();
    cy.get('#button-cart').should('be.visible').click();
    cy.xpath("//div[@class='alert alert-success alert-dismissible']").should('contains.text', 'Success: You have added')
  
    //Return the home
    cy.xpath("//a[contains(.,'Your Store')]").should('be.visible').click();
    cy.wait(1000);

    //Add the second item - Camera
    cy.xpath("//a[contains(.,'Canon EOS 5D')]").should('be.visible').click();
    cy.get('#input-option226').should('be.visible').select('Red');
    cy.get('#button-cart').should('be.visible').click();
    cy.xpath("//div[@class='alert alert-success alert-dismissible']").should('contains.text', 'Success: You have added')
  
    //Validate that the 2 items exist in the cart and can be checked out 
    cy.get('#cart-total').should('contain.text', '2').then(() => { 
      cy.origin('https://opencart.abstracta.us', () => {
      cy.visit('/index.php?route=checkout/checkout');
      cy.get(':nth-child(1) > :nth-child(4) > label').should('be.visible').click();
      cy.get('#button-account').should('be.visible').click().then(() => {
        cy.wait(1000);
        //Your Personal Details
        cy.get('#input-payment-firstname').should('be.visible').type('Katherine');
        cy.get('#input-payment-lastname').should('be.visible').type('Perez');
        cy.get('#input-payment-email').should('be.visible').type('katherine@gmail.com')
        cy.get('#input-payment-telephone').should('be.visible').type(76311784)
        //Your Address
        cy.get('#input-payment-address-1').should('be.visible').type('Managua');
        cy.get('#input-payment-city').should('be.visible').type('Managua');
        cy.get('#input-payment-postcode').should('be.visible').type(11234);
        cy.get('#input-payment-country').should('be.visible').select('Nicaragua');
        cy.get('#input-payment-zone').should('be.visible').select('Managua');
        cy.get('#button-guest').should('be.visible').click({force: true});

        //Delivery Method
        cy.get('#button-shipping-method').should('be.visible').click({force: true});

        //Payment Method
        cy.get('#collapse-payment-method > .panel-body > :nth-child(3)').should('be.visible').click({force: true});
        cy.get('#collapse-payment-method > .panel-body > :nth-child(5) > .form-control').should('be.visible').type('Nothing special')
        cy.get('.pull-right > [type="checkbox"]').should('be.visible').check();
        cy.get('#button-payment-method').should('be.visible').click({force: true});
        
      })
      //Confirm order
    })
    cy.get('#button-confirm').should('be.visible').click({force: true});
    cy.xpath("//h1[contains(text(),'Your order has been placed!')]").should('contains.text', 'Your order has been placed');
    })
  
  })
})