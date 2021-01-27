define([
    'jquery',
    'mage/translate'
], function ($,$t) {
    'use strict';

    return function (widget) {

        $.widget('mage.SwatchRenderer', widget, {
          /**
           * Return intersection from multi dimentional array
           *
           * @returns {Array}
           * @private
           */

          _IntersectionArray: function () {
            var result = [];
            var lists;

            if(arguments.length === 1) {
              lists = arguments[0];
            } else {
              lists = arguments;
            }

            for(var i = 0; i < lists.length; i++) {
              var currentList = lists[i];
              for(var y = 0; y < currentList.length; y++) {
                var currentValue = currentList[y];
                if(result.indexOf(currentValue) === -1) {
                  var existsInAll = true;
                  for(var x = 0; x < lists.length; x++) {
                    if(lists[x].indexOf(currentValue) === -1) {
                      existsInAll = false;
                      break;
                    }
                  }
                  if(existsInAll) {
                    result.push(currentValue);
                  }
                }
              }
            }
            return result;
          },
          /**
           * Rebuild container
           *
           * @private
           */
          _Rebuild: function () {
              var $widget = this,
                  controls = $widget.element.find('.' + $widget.options.classes.attributeClass + '[attribute-id]'),
                  selected = controls.filter('[option-selected]');
              var selectedProducts = [],
                  intersectionProducts = [];

              // Enable all options
              $widget._Rewind(controls);

              // done if nothing selected
              if (selected.length <= 0) {
                  return;
              }
              selected.each(function () {
                var $this = $(this),
                    id = $this.attr('attribute-id'),
                    products = $widget._CalcProducts(id);
                selectedProducts.push($widget.optionsMap[id][$this.attr('option-selected')].products);
              });
              intersectionProducts = $widget._IntersectionArray(selectedProducts);

              if(intersectionProducts.length == 1){
                if(!$widget.options.cpsdProducts[intersectionProducts[0]].instock){
                  document.getElementById("product-addtocart-button").disabled = true;
                  $('.product-info-stock-sku .stock').removeClass('available');
                  $('.product-info-stock-sku .stock').addClass('unavailable');
                  $('.product-info-stock-sku .stock span').text($t('Out Of Stock'));
                } else {
                  document.getElementById("product-addtocart-button").disabled = false;
                  $('.product-info-stock-sku .stock').removeClass('unavailable');
                  $('.product-info-stock-sku .stock').addClass('available');
                  $('.product-info-stock-sku .stock span').text($t('In Stock'));
                }
                $('.product-info-stock-sku .product.attribute.sku').show();
              } else if(intersectionProducts.length == 0){
                document.getElementById("product-addtocart-button").disabled = true;
                $('.product-info-stock-sku .stock').removeClass('available');
                $('.product-info-stock-sku .stock').addClass('unavailable');
                $('.product-info-stock-sku .stock span').text($t('Product Discontinued'));
                $('.product-info-stock-sku .product.attribute.sku').hide();
              } else {
                $('.product-info-stock-sku .product.attribute.sku').hide();
              }
          }
        });

        return $.mage.SwatchRenderer;
    }
});
