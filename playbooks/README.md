Ansible Playbooks
====
Ansible Playbooks are used to regulate and automate deployment of projects to Docker servers.

Configure /etc/ansible/hosts
    
    [freds-qa]
    dckrdb01linp10

Update the QA environment
    
    ansible-playbook -v update-qa.yml

Start the QA environment
    
    ansible-playbook -v start-qa.yml

Stop the QA environment
    
    ansible-playbook -v stop-qa.yml

