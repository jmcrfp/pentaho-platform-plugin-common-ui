/*!
 * Copyright 2018 Hitachi Vantara. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
  "pentaho/i18n!messages",

  // so that r.js sees otherwise invisible dependencies.
  "pentaho/visual/role/mappingField"
], function(bundle) {

  "use strict";

  return [
    "complex",
    "./mappingField",
    function(Complex, MappingField) {

      /**
       * @name pentaho.visual.role.AbstractMapping.Type
       * @class
       * @extends pentaho.type.Complex.Type
       *
       * @classDesc The type class of {@link pentaho.visual.role.AbstractMapping}.
       */

      /**
       * @name pentaho.visual.role.AbstractMapping
       * @class
       * @extends pentaho.type.Complex
       * @abstract
       *
       * @amd {pentaho.type.spec.UTypeModule<pentaho.visual.role.AbstractMapping>} pentaho/visual/role/abstractMapping
       *
       * @classDesc The `AbstractMapping` class is the base class for associations between
       * a visual role and data fields of a visualization's current data set.
       *
       * A mapping contains a list of [fields]{@link pentaho.visual.role.AbstractMapping#fields},
       * each of the type [MappingField]{@link pentaho.visual.role.MappingField}.
       *
       * @description Creates a visual role mapping instance.
       * @constructor
       * @param {pentaho.visual.role.spec.IAbstractMapping} [spec] A visual role mapping specification.
       */
      var AbstractMapping = Complex.extend(/** @lends pentaho.visual.role.AbstractMapping# */{

        /**
         * Gets a value that indicates if the mapping has any fields.
         *
         * @type {boolean}
         * @readonly
         */
        get hasFields() {
          return this.fields.count > 0;
        },

        /**
         * Resets any existing adaptation related cached information.
         *
         * Called by the containing abstract model whenever its data or visual role properties change.
         *
         * @protected
         * @friend pentaho.visual.base.AbstractModel
         */
        _onDataOrMappingChanged: function() {
        },

        /**
         * Gets the reference corresponding to the containing abstract model and visual role property, if any.
         *
         * @type {?({container: pentaho.visual.base.AbstractModel, property: pentaho.visual.role.AbstractProperty})}
         * @readOnly
         * @protected
         */
        get _modelReference() {
          var refs = this.$references;
          if(refs && refs.length) {
            return refs[0];
          }

          return null;
        },

        /**
         * Gets an array of the indexes of data set columns of the mapped fields.
         *
         * If there is no container model, or the model has no data set, `null` is returned.
         * If any of the mapped fields is not defined in the data set, `null` is returned.
         *
         * @type {!Array.<number>}
         * @readOnly
         */
        get fieldIndexes() {

          var fieldIndexes = null;

          var iref = this._modelReference;
          if(iref !== null) {
            var data = iref.container.data;
            if(data !== null) {
              var mappingFields = this.fields;
              var fieldCount = mappingFields.count;
              var mappingFieldIndex = -1;
              fieldIndexes = new Array(fieldCount);

              while(++mappingFieldIndex < fieldCount) {
                var fieldName = mappingFields.at(mappingFieldIndex).name;
                var fieldIndex = data.getColumnIndexById(fieldName);
                if(fieldIndex < 0) {
                  return null;
                }

                fieldIndexes[mappingFieldIndex] = fieldIndex;
              }
            }
          }

          return fieldIndexes;
        },

        /**
         * Gets the _effective_ operation mode in which the associated visual role is to operate.
         *
         * @name pentaho.visual.role.AbstractMapping#mode
         * @type {pentaho.visual.role.Mode}
         * @readonly
         */

        $type: /** @lends pentaho.visual.role.AbstractMapping.Type# */{
          props: [
            /**
             * Gets or sets the fields of the visual role mapping.
             *
             * @name pentaho.visual.role.AbstractMapping#fields
             * @type {pentaho.type.List<pentaho.visual.role.MappingField>}
             */
            {name: "fields", valueType: [MappingField]}
          ]
        }
      })
      .implement({$type: bundle.structured.abstractMapping});

      return AbstractMapping;
    }
  ];
});