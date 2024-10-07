/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search','N/format'],

function(record, search,format) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        var currentRecord = scriptContext.currentRecord;
        var fieldId = scriptContext.fieldId;
        
        if (fieldId === 'custpage_bloodgroup') {
            var bloodGroup = currentRecord.getValue('custpage_bloodgroup');

            // Get the current date and calculate the date three months ago
            var currentDate = new Date();
            var threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

            // Format the date for NetSuite compatibility
            var formattedThreeMonthsAgo = format.format({
                value: threeMonthsAgo,
                type: format.Type.DATE
            });

            // Create a search to find records matching the selected blood group and last donation date more than 3 months ago
            var mySearch = search.create({
                title: "Blood Donor",
                type: 'customrecord5',
                filters: [
                    ['custrecord_jj_bloodgroup', 'is', bloodGroup],
                    'AND',
                    ['custrecord_jj_lastdonation', 'onorbefore', formattedThreeMonthsAgo]
                ],
                columns: ['custrecord_jj_firstname', 'custrecord_jj_phonenumber', 'custrecord_jj_lastdonation']
            });

            var searchResult = mySearch.run().getRange({
                start: 0,
                end: 50 // Limiting to 50 records, adjust as needed
            });

            // Clear any existing lines in the sublist before adding new ones
            var sublistId = 'bloodsublist';
            var lineCount = currentRecord.getLineCount({ sublistId: sublistId });
            for (var j = 0; j < lineCount; j++) {
                currentRecord.removeLine({
                    sublistId: sublistId,
                    line: 0, // Always remove the first line since lines will shift
                    ignoreRecalc: true
                });
            }
            
            // Loop through the search results and populate the sublist
            for (var i = 0; i < searchResult.length; i++) {
                var donorName = searchResult[i].getValue('custrecord_jj_firstname');
                var donorNumber = searchResult[i].getValue('custrecord_jj_phonenumber');
                
                // Select a new line in the sublist
                currentRecord.selectNewLine({
                    sublistId: sublistId
                });

                // Set donor name and phone number in the sublist fields
                currentRecord.setCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: 'custpage_donorname',
                    value: donorName
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: 'custpage_mobilenumber',
                    value: donorNumber
                });

                // Commit the line
                currentRecord.commitLine({
                    sublistId: sublistId
                });
            }
        }
    }
    
    

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    return {
        // pageInit: pageInit,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord
    };
    
});
