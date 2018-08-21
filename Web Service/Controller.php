<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Controller extends CI_Controller {

	public function index()
	{
		header('Content-Type: application/json');

		$data = $this->db->query('SELECT * FROM `feed` ORDER BY `feed`.`feedId` DESC')->result_array();
		echo json_encode($data);
	}

	function upload()
	{

		if (empty($_FILES['file']['name']) || empty($_POST['feed_desc'])) {
			
			echo json_encode(array('status' => 404, 'message' => 'Please insert valid data'));
			return ;

		}else{
			
			$config['upload_path']   = './uploads/'; 
	        $config['allowed_types'] = 'gif|jpg|png';
	        $config['file_name'] = $this->random_string() . '.png';
	        $this->load->library('upload', $config);
			
	        if ( ! $this->upload->do_upload('file')) {
	           echo json_encode(array('status' => 404, 'message' => $this->upload->display_errors()));
	           return ;
	        }
	        else {
	            $data = $this->upload->data();
	            $ImageUrl = base_url().'uploads/'.$data['file_name'];

	            $sqlData = array('feed_desc' => $_POST['feed_desc'], 'image' => $ImageUrl, 'feed_like' => 'Unlike');

	            $this->db->insert('feed', $sqlData);
	            if($this->db->insert_id()){
	            	echo json_encode(array('status' => 200, 'message' => 'File Uploading Success!'));
	            	return ;
	            }else{
	            	echo json_encode(array('status' => 503, 'message' => 'Something is Wrong in Mysql!'));
	            	return ;
	            }
	        }

		}
		
	}

	function random_string() 
	{
	    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	    $password = array(); 
	    $alpha_length = strlen($alphabet) - 1; 
	    for ($i = 0; $i < 8; $i++) 
	    {
	        $n = rand(0, $alpha_length);
	        $password[] = $alphabet[$n];
	    }
	    return implode($password); 
	}

}
