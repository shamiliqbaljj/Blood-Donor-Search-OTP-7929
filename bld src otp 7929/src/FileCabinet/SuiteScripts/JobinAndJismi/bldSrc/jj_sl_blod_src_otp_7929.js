/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'],
    
    (serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = serverWidget.createForm({
                    title: 'Blood Donor',
                });
                
                let bloodGroupField = form.addField({
                    id: 'custpage_bloodgroup',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Blood Group',
                })
                bloodGroupField.isMandatory = true;

                // Adding the Select Options
                const bloodGroups = [
                    { value: '', text: '' },  // Default "Select" option
                    { value: 'A+', text: 'A+' },
                    { value: 'A-', text: 'A-' },
                    { value: 'B+', text: 'B+' },
                    { value: 'B-', text: 'B-' },
                    { value: 'AB+', text: 'AB+' },
                    { value: 'AB-', text: 'AB-' },
                    { value: 'O+', text: 'O+' },
                    { value: 'O-', text: 'O-' }
                ];

                bloodGroups.forEach(group => {
                    bloodGroupField.addSelectOption({
                        value: group.value,
                        text: group.text
                    });
                });

                var subList = form.addSublist({
                    id: 'bloodsublist',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'Blood Donor Sublist',
                });
                subList.addField({
                    id: 'custpage_donorname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                });
                subList.addField({
                    id: 'custpage_mobilenumber',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Mobile Number'
                });
                scriptContext.response.writePage(form);
                form.clientScriptModulePath = 'SuiteScripts/JobinAndJismi/bldSrc/jj_cs_bld_src_otp_7929.js';

        }
    }
        return {onRequest}

    });
