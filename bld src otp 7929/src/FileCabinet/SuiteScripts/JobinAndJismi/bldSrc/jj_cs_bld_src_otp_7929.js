/**
 * 
 * Client : Nill
 * 
 * OTP 7929 - Search through the database to find the matching blood donors
 * 
 * ------------------------------------------------------------------------
 * 
 * Author : Jobin And Jismi IT Services
 * 
 * Date Created : 07 - October - 2024
 * 
 * Description : This script is for populating the details of blood donors when a blood group is selected
 * 
 * REVISION HISTORY : 1.0
 * 
 * ------------------------------------------------------------------------
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/format'],

    function(record, search, format) {
        
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
            try {
                var currentRecord = scriptContext.currentRecord;
                var fieldId = scriptContext.fieldId;
    
                // Trigger the search when the blood group or the date filter changes
                if (fieldId === 'custpage_bloodgroup' || fieldId === 'custpage_lastdonation') {
                    var bloodGroup = currentRecord.getValue('custpage_bloodgroup');
                    var selectedDate = currentRecord.getValue('custpage_lastdonation'); // Selected custom date filter
    
                    var filters = [];
    
                    // If a custom date is selected, use it without blood group filtering
                    if (selectedDate) {
                        var filterDate = new Date(selectedDate);
    
                        // Format the date for NetSuite compatibility
                        var formattedFilterDate = format.format({
                            value: filterDate,
                            type: format.Type.DATE
                        });
    
                        // Search for records where the last donation date is on or before the selected date
                        filters.push(['custrecord_jj_lastdonation', 'onorbefore', formattedFilterDate]);
    
                    } else if (bloodGroup) {
                        // If no date is selected, apply the 3-months-before logic with blood group filter
                        var currentDate = new Date();
                        var threeMonthsAgo = new Date();
                        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    
                        var formattedThreeMonthsAgo = format.format({
                            value: threeMonthsAgo,
                            type: format.Type.DATE
                        });
    
                        // Apply the blood group filter and the 3-months-before filter
                        filters.push(
                            ['custrecord_jj_bloodgroup', 'is', bloodGroup],
                            'AND',
                            ['custrecord_jj_lastdonation', 'onorbefore', formattedThreeMonthsAgo]
                        );
                    }
    
                    // Create a search to find records based on the filters
                    var mySearch = search.create({
                        title: "Blood Donor",
                        type: 'customrecord5',
                        filters: filters,
                        columns: [
                            'custrecord_jj_firstname',
                            'custrecord_jj_phonenumber',
                            'custrecord_jj_lastdonation'
                        ]
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
            } catch (error) {
                log.error(error);
            }
        }
    
        return {
            fieldChanged: fieldChanged
        };
    });
    