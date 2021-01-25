<?php

namespace Godogi\Swatches\Block\Rewrite\Product;

use Best4Mage\CPSD\Block\Rewrite\Product\Configurable as MainConfigurable;

class Configurable extends MainConfigurable
{
    /**
     * Get all products data for swatch js
     * @return json object
     */
    public function getAllProductsData()
    {
        $allProducts = [];
        $childPrices = [];
        $product = $this->getProduct();
        $preselectType = $this->getCpsdHelper()->getPreselectType($product);
        $attributes = $product->getTypeInstance()->getUsedProductAttributes($product);
        $attrCode = [];
        $attrName = [];
        foreach ($attributes as $key => $attr) {
            $attrCode[$key] = $attr->getAttributeCode();
            $attrName[] = $attr->getAttributeCode();
        }

        $allProducts[0] = $this->_getProductData($product, $attrName);

        // $childProducts = $product->getTypeInstance()->getUsedProducts($product);
        $childProducts = $product->getTypeInstance()->getUsedProductIds($product);
        if (count($childProducts)) {
            foreach ($childProducts as $spd) {
                $childProduct = $this->productRepository->getById($spd);
                $spConfig = [];
                foreach ($attrCode as $key => $code) {
                    $attr = $product->getResource()->getAttribute($code);
                    $opId = $attr->getSource()->getOptionId($childProduct->getAttributeText($code));
                    $spConfig[$key] = $opId;
                }
                $childPrices[$childProduct->getId()] = $childProduct->getFinalPrice();

                $allProducts[$childProduct->getId()] = array_merge(['spConfig' => $spConfig], $this->_getProductData($childProduct, $attrName));
            }
            $preselect = 0;
            if ($preselectType == 1) {
                if (count($childPrices)) {
                    $preselect = array_search(min($childPrices), $childPrices);
                }
            } elseif ($preselectType == 2) {
                if (count($childPrices)) {
                    $preselect = array_search(max($childPrices), $childPrices);
                }
            } elseif ($preselectType == 3) {
                $preselect = $this->getCpsdHelper()->getPreselectOption($product);
            }
            $allProducts['preselect'] = $preselect;
        }

        return $this->jsonEncoder->encode($allProducts);
    }
}
